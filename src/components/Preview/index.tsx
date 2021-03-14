import './preview.css';
import React, { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
}

const Index: React.FC<PreviewProps> = ({ code }) => {
  useEffect(() => {
    iFrameRef.current.srcdoc = html;
    iFrameRef.current.contentWindow.postMessage(code, '*');
  }, [code]);

  const iFrameRef = useRef<any>();

  return (
    <div className='preview-wrapper'>
      <iframe
        title='preview'
        srcDoc={html}
        sandbox='allow-scripts'
        ref={iFrameRef}
      />
    </div>
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

export default Index;
