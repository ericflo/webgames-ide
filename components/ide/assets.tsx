import React from 'react';

import { Asset, AssetType } from '../data';

type Props = {
  className?: string;
  assets: Asset[];
};

const Assets = ({ className, assets }: Props) => (
  <div className={className}>
    <p>Assets</p>
    <ul>
      {assets.map((asset: Asset, i: number) => {
        return (
          <li key={i} className="mb-1">
            {asset.type == AssetType.Sprite ? (
              <img
                src={asset.skylink.replace('sia:', 'https://siasky.net/')}
                className="w-8 h-8 inline mx-1"
              />
            ) : null}
            {asset.name}
          </li>
        );
      })}
    </ul>
  </div>
);

export default Assets;
