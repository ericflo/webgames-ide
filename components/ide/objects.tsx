import React from 'react';

type Props = {
  className?: string
}

const Objects = ({ className }: Props) => (
  <div className={className + ' bg-yellow-500'}><p>Objects</p></div>
);

export default Objects;