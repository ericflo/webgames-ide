import React, { useCallback } from 'react';

import { Asset, AssetType } from '../data';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

type Props = {
  asset: Asset;
  onMoreClick: (asset: Asset) => void;
};

const AssetRow = ({ asset, onMoreClick }: Props) => {
  const handleMoreClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      onMoreClick(asset);
    },
    [asset]
  );
  return (
    <div className="mb-1 flex place-items-center">
      {asset.type == AssetType.Sprite ? (
        <img
          src={asset.skylink.replace('sia:', 'https://siasky.net/')}
          className="w-8 h-8 inline mx-1 flex-none"
        />
      ) : null}
      <span className="flex-1">{asset.name}</span>
      <button className="float-right mx-3 flex-none" onClick={handleMoreClick}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
    </div>
  );
};

export default AssetRow;
