import './resizable.css';
import React from 'react';
import { ResizableBox } from 'react-resizable';

interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox resizeHandles={['s']} width={Infinity} height={300}>
      {children}
    </ResizableBox>
  );
};

export default Resizable;
