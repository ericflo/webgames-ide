import React from 'react';
import LayerChooser from './layerchooser';

type Props = {
  className?: string
}

const Objects = ({ className }: Props) => (
  <div className={className}>
    <LayerChooser
      className="flex-none"
      layerNames={['obj', 'bg', 'ui']}
      onChange={(name: string) => console.log(name)} />
  </div>
);

export default Objects;