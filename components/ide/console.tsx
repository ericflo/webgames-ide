import React from 'react';

type Props = {
  className?: string
}

const Console = ({ className }: Props) => (
  <div className={className + ' bg-green-500'}><p>Console</p></div>
);

export default Console;