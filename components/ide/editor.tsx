import React from 'react';

type Props = {
  className?: string
}

const Editor = ({ className }: Props) => (
  <div className={className + ' bg-blue-500'}><p>Editor</p></div>
);

export default Editor;