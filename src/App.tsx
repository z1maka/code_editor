import React, { useState } from 'react';
import bundle from './bundler';
import CodeEditor from './components/CodeEditor';
import Preview from './components/Preview';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

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
      <Preview code={code} />
    </div>
  );
};

export default App;
