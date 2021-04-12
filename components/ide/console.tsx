import React from 'react';

type Props = {
  className?: string;
};

const Console = ({ className }: Props) => (
  <div className={className}>
    <h3 className="mx-5 my-2 font-light text-black text-opacity-70">Console</h3>
  </div>
);

export default Console;
