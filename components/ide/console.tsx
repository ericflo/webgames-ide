import React from 'react';

type Props = {
  className?: string;
};

const Console = ({ className }: Props) => (
  <div className={className}>
    <h3 className="m-2 font-light text-black text-opacity-70">Console</h3>
  </div>
);

export default Console;
