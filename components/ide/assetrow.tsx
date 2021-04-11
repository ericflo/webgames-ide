import React from 'react';

import { Asset, AssetType } from '../data';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

type Props = {
  asset: Asset;
};

const AssetRow = ({ asset }: Props) => (
  <div className="mb-1 flex place-items-center">
    {asset.type == AssetType.Sprite ? (
      <img
        src={asset.skylink.replace('sia:', 'https://siasky.net/')}
        className="w-8 h-8 inline mx-1 flex-none"
      />
    ) : null}
    <span className="flex-1">{asset.name}</span>
    <FontAwesomeIcon
      className="float-right mx-3 flex-none"
      icon={faEllipsisV}
    />
  </div>
);

export default AssetRow;
