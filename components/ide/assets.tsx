import React from 'react';

type Props = {
  className?: string
}

const Assets = ({ className }: Props) => (
  <div className={className + ' bg-red-500'}><p>Assets</p></div>
);

export default Assets;