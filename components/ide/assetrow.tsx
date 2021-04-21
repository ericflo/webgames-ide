import React, { useCallback } from 'react';

import { Asset, AssetType } from '../data';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { isProd, isHandshake } from '../buildconfig';

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
    <div className="mb-1 flex place-items-center select-none">
      {asset.type == AssetType.Sprite ? (
        <img
          src={asset.skylink.replace(
            'sia:',
            isProd && isHandshake ? '/' : 'https://siasky.net/'
          )}
          className="w-8 h-8 inline ml-4 flex-none"
        />
      ) : null}
      <span className="flex-1 ml-4">{asset.name}</span>
      <button
        className="float-right mr-3 px-2.5 flex-none"
        onClick={handleMoreClick}
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
    </div>
  );
};

export default AssetRow;
