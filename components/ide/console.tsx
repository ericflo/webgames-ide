import React from 'react';

type Props = {
  className?: string;
};

const Console = ({ className }: Props) => (
  <div className={className}>
    <p>Console</p>
  </div>
);

export default Console;
