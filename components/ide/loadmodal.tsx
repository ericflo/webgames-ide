import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import { API } from '../api';
import SceneData, { makeEmptySceneData } from '../data';

type Props = {
  className?: string;
  api: API;
  hasChanges: boolean;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

const LoadModal = ({
  className,
  api,
  hasChanges,
  setHasChanges,
  onClose,
}: Props) => {
  const handleBackgroundClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      onClose();
    },
    [onClose]
  );

  return (
    <div
      className={
        'absolute top-0 right-0 bottom-0 left-0 flex place-items-center place-content-center ' +
        (className || '')
      }
    >
      <div className="absolute w-1/2 h-2/3 bg-white bg-opacity-100 rounded-xl p-4 z-20 shadow">
        <h3 className="text-4xl mx-6 my-6 font-bold select-none">
          Project Browser
          <FontAwesomeIcon
            className="float-right cursor-pointer"
            icon={faTimes}
            onClick={handleBackgroundClick}
          />
        </h3>
        <div className="overflow-x-hide overflow-y-scroll">
          {api.gamesList.map((filename: string) => {
            const handleFilenameClick = (ev: React.MouseEvent) => {
              //useCallback(
              ev.preventDefault();
              if (
                hasChanges &&
                !confirm(
                  'Are you sure you want to load this project? You have unsaved changes which will be lost.'
                )
              ) {
                return;
              }
              setHasChanges(false);
              api.setCurrentSceneData(
                (_: SceneData): SceneData => {
                  return makeEmptySceneData();
                }
              );
              api.currentFilename = filename;
              api.loadCurrentSceneData().then((sceneData: SceneData) => {
                api.setCurrentSceneData(
                  (_: SceneData): SceneData => {
                    return sceneData;
                  }
                );
              });
              onClose();
            }; //,
            //[api, filename, hasChanges, onClose]
            //);

            const handleDeleteClick = (ev: React.MouseEvent) => {
              //useCallback(
              ev.preventDefault();
              if (!confirm('Are you sure you want to delete ' + filename)) {
                return;
              }
              api.setGamesList((gamesList: string[]): string[] => {
                const resp = gamesList.filter((fn: string): boolean => {
                  return fn != filename;
                });
                console.log('resp', resp);
                return resp;
              });
            }; //,
            //  [api, filename]
            //);

            return (
              <div key={filename} className="my-6 mx-6 text-gray-600 text-2xl">
                <span
                  className={
                    'select-none ' +
                    (filename == api.currentFilename
                      ? 'text-black pointer-events-none---tmpdisable'
                      : 'text-blue-600 cursor-pointer')
                  }
                  onClick={handleFilenameClick}
                >
                  {filename}
                </span>
                <FontAwesomeIcon
                  className={
                    'float-right cursor-pointer' +
                    (filename == api.currentFilename
                      ? ' opacity-50 pointer-events-none select-none'
                      : '')
                  }
                  icon={faTrash}
                  onClick={handleDeleteClick}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="absolute w-screen h-screen bg-white bg-opacity-90 z-10"
        onClick={handleBackgroundClick}
      />
    </div>
  );
};

export default LoadModal;
