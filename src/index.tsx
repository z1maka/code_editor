import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDom from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/CodeEditor';

const App = () => {
  const ref = useRef<any>();
  const iFrameRef = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iFrameRef.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin, fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // setCode(result.outputFiles[0].text);

    iFrameRef.current.contentWindow.postMessage(
      result.outputFiles[0].text,
      '*'
    );
  };

  const html = `
    <html>
        <head></head>
        <body>
            <div id="root"></div>
        <script>
        window.addEventListener('message', (event) => {
            try {
              eval(event.data)
            }catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Run time error!</h4>' + err + '</div>';
              console.error(err);  
            }
        }, false)
        </script>
        </body>
    </html>
  `;

  return (
    <div>
      <CodeEditor
        onChange={(value) => setInput(value)}
        initialValue='// Начните писать код!'
      />
      <div>
        <button style={{ margin: '10px 0px 10px 0px' }} onClick={onClick}>
          Submit
        </button>
      </div>

      <div>
        <iframe
          title='Code preview'
          ref={iFrameRef}
          sandbox='allow-scripts'
          srcDoc={html}
        />
      </div>
    </div>
  );
};

ReactDom.render(<App />, document.querySelector('#root'));
