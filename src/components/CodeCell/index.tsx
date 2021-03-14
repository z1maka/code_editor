import React, { useState } from 'react';
import bundle from '../../bundler';
import Editor from '../Editor';
import Preview from '../Preview';
import Resizable from '../Resizable/Resizable';

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const output = await bundle(input);
    setCode(output);
  };

  return (
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Editor
          onChange={(value) => setInput(value)}
          initialValue='// Начните писать код!'
        />
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
