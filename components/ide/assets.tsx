import React from 'react';

import { Asset, AssetType } from '../data';

import AssetRow from './assetrow';

type Props = {
  className?: string;
  assets: Asset[];
};

const Assets = ({ className, assets }: Props) => (
  <div className={className + ' flex flex-col'}>
    <h3 className="flex-none m-2 font-light text-black text-opacity-70">
      Assets
    </h3>
    <div className="flex-1 overflow-y-scroll overflow-x-hide">
      {assets.map((asset: Asset, i: number) => {
        return <AssetRow key={i} asset={asset} />;
      })}
    </div>
  </div>
);

export default Assets;
