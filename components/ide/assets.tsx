import React, { useCallback, useState } from 'react';

import { FileWithPath } from 'react-dropzone';

import { UploadRequestResponse } from 'skynet-js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

import { Asset, AssetType } from '../data';

import AssetRow from './assetrow';
import { API } from '../api';

type Props = {
  className?: string;
  assets: Asset[];
  onAssetDelete: (asset: Asset) => void;
  isUploading: Boolean;
  addAssetModalActive: Boolean;
  setAddAssetModalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const Assets = ({
  className,
  assets,
  isUploading,
  addAssetModalActive,
  setAddAssetModalActive,
  onAssetDelete,
}: Props) => {
  const [currentAsset, setCurrentAsset] = useState(null as Asset);
  const handleMoreClick = useCallback((asset: Asset) => {
    setCurrentAsset(asset);
  }, []);
  const hasCurrentAsset = !!currentAsset;
  const handleClick = useCallback((ev: React.MouseEvent) => {
    if (!ev.defaultPrevented) {
      setCurrentAsset(null);
      setAddAssetModalActive(false);
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
  const handleAddAssetClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    setAddAssetModalActive(true);
  }, []);
  return (
    <div
      className={className + ' flex flex-col relative'}
      onClick={handleClick}
    >
      {isUploading ? (
        <div className="absolute w-full h-full bg-black bg-opacity-80 flex flex-col place-content-center place-items-center">
          <p className="text-white mx-8 mb-4">
            Processing your asset upload now...
          </p>
        </div>
      ) : null}
      {addAssetModalActive && !isUploading ? (
        <div className="absolute w-full h-full bg-black bg-opacity-80 flex flex-col place-content-center place-items-center">
          <p className="text-white mx-8 mb-4">
            Drag assets onto your browser and they will show up here.
          </p>
          <button className="w-2/3 h-1/6 bg-white display-block rounded-md text-black border-2 border-gray-300">
            OK
          </button>
        </div>
      ) : null}
      {hasCurrentAsset && !isUploading ? (
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
      <h3 className="flex flex-none mx-5 my-2 font-light text-black text-opacity-70">
        <span className="flex-1">Assets</span>
      </h3>
      <div className="flex-1 overflow-y-scroll overflow-x-hide">
        {assets.map((asset: Asset, i: number) => {
          return (
            <AssetRow
              key={asset.skylink}
              asset={asset}
              onMoreClick={handleMoreClick}
            />
          );
        })}
      </div>
      {isUploading || addAssetModalActive ? null : (
        <button
          className="absolute bottom-3 right-3 bg-white bg-opacity-60 w-10 h-10 rounded-full border border-gray-500 shadow-2xl"
          onClick={handleAddAssetClick}
        >
          <FontAwesomeIcon icon={faPlusSquare} className="text-gray-800" />
        </button>
      )}
    </div>
  );
};

export function useOnAssetDrop(
  api: API,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setAddAssetModalActive: React.Dispatch<React.SetStateAction<boolean>>
) {
  return useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setIsUploading(true);
      Promise.all(
        acceptedFiles.map((acceptedFile: FileWithPath) => {
          let assetType: AssetType;
          if (
            acceptedFile.name.endsWith('.png') ||
            acceptedFile.name.endsWith('.jpg') ||
            acceptedFile.name.endsWith('.jpeg')
          ) {
            assetType = AssetType.Sprite;
          } else if (
            acceptedFile.name.endsWith('.wav') ||
            acceptedFile.name.endsWith('.ogg') ||
            acceptedFile.name.endsWith('.mp3')
          ) {
            assetType = AssetType.Sound;
          } else {
            return null;
          }
          return api.client
            .uploadFile(acceptedFile)
            .then((response: UploadRequestResponse) => {
              const asset: Asset = {
                name: acceptedFile.name,
                type: assetType,
                skylink: response.skylink,
              };
              const sd = api.currentSceneData;
              if (sd.assets) {
                sd.assets.push(asset);
              } else {
                sd.assets = [asset];
              }
              api.currentSceneData = sd;
            });
        })
      ).then(() => {
        api.saveCurrentSceneData();
        setIsUploading(false);
        setAddAssetModalActive(false);
      });
    },
    [api]
  );
}

export default Assets;
