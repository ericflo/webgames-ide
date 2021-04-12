import React, { useCallback, useState } from 'react';

import { Asset, AssetType } from '../data';

import AssetRow from './assetrow';

type Props = {
  className?: string;
  assets: Asset[];
  onAssetDelete: (asset: Asset) => void;
};

const Assets = ({ className, assets, onAssetDelete }: Props) => {
  const [currentAsset, setCurrentAsset] = useState(null as Asset);
  const handleMoreClick = useCallback((asset: Asset) => {
    setCurrentAsset(asset);
  }, []);
  const hasCurrentAsset = !!currentAsset;
  const handleClick = useCallback((ev: React.MouseEvent) => {
    if (!ev.defaultPrevented) {
      setCurrentAsset(null);
    }
  }, []);
  const handleDeleteAssetClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      if (confirm('Are you sure you want to delete ' + currentAsset.name)) {
        onAssetDelete(currentAsset);
        setCurrentAsset(null);
      }
    },
    [currentAsset]
  );
  return (
    <div
      className={className + ' flex flex-col relative'}
      onClick={handleClick}
    >
      {hasCurrentAsset ? (
        <div className="absolute w-full h-full bg-black bg-opacity-50 flex flex-col place-content-center place-items-center">
          {currentAsset.type == AssetType.Sprite ? (
            <img
              src={currentAsset.skylink.replace('sia:', 'https://siasky.net/')}
              className="max-h-16 max-w-6xl inline mb-2 flex-none"
            />
          ) : null}
          <strong className="mb-2 text-white">{currentAsset.name}</strong>
          <button
            className="w-2/3 h-1/6 bg-red-600 display-block mb-2 rounded-md text-black border-2 border-black"
            onClick={handleDeleteAssetClick}
          >
            Delete
          </button>
          <button className="w-2/3 h-1/6 bg-white display-block rounded-md text-black border-2 border-gray-300">
            Cancel
          </button>
        </div>
      ) : null}
      <h3 className="flex-none m-2 font-light text-black text-opacity-70">
        Assets
      </h3>
      <div className="flex-1 overflow-y-scroll overflow-x-hide">
        {assets.map((asset: Asset, i: number) => {
          return (
            <AssetRow key={i} asset={asset} onMoreClick={handleMoreClick} />
          );
        })}
      </div>
    </div>
  );
};

export default Assets;
