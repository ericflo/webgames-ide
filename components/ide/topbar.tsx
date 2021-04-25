import {
  faCheck,
  faCircleNotch,
  faPlay,
  faSave,
  faStop,
  faSync,
  faFileMedical,
  faFolderOpen,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';
import { API } from '../api';
import { isHandshake, isProd } from '../buildconfig';
import SceneData from '../data';

type Props = {
  api: API;
  isPlaying: boolean;
  isEditingAction: boolean;
  isLoggedIn: boolean;
  isSaving: boolean;
  isLoading: boolean;
  hasChanges: boolean;
  hasCodeChanges: boolean;
  currentFilename: string;
  sceneData: SceneData;
  onDoneEditingAction: () => void;
  onPlayClick: () => void;
  onReloadClick: () => void;
  onSaveClick: () => void;
  onLoginClick: () => void;
  onNewClick: () => void;
  onLoadClick: () => void;
};

function usePreventDefault(fn: () => void): (ev: React.MouseEvent) => void {
  return useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      fn();
    },
    [fn]
  );
}

const TopBar = ({
  api,
  isPlaying,
  isEditingAction,
  isLoggedIn,
  isSaving,
  isLoading,
  hasChanges,
  hasCodeChanges,
  currentFilename,
  sceneData,
  onDoneEditingAction,
  onPlayClick,
  onReloadClick,
  onSaveClick,
  onLoginClick,
  onNewClick,
  onLoadClick,
}: Props) => {
  const handleDoneEditingAction = usePreventDefault(onDoneEditingAction);
  const handlePlayClick = usePreventDefault(onPlayClick);
  const handleReloadClick = usePreventDefault(onReloadClick);
  const handleSaveClick = usePreventDefault(onSaveClick);
  const handleLoginClick = usePreventDefault(onLoginClick);
  const handleNewClick = usePreventDefault(onNewClick);
  const handleLoadClick = usePreventDefault(onLoadClick);
  const handleExportClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      const win = window.open('about:blank', '_blank');
      api.client
        .uploadDirectory(
          {
            'index.html': new File(
              [
                `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
    html, body, canvas, iframe {
      padding: 0;
      margin: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(255,255,255,0) !important;
      text-align: center;
    }
    </style>
  </head>
  <body>
    <iframe src="${
      '/player.html?scenedata=' + encodeURIComponent(JSON.stringify(sceneData))
    }" />
  </body>
</html>`,
              ],
              'index.html'
            ),
          },
          'game'
        )
        .then((resp) => {
          win.location.href = resp.skylink.replace(
            'sia:',
            isProd && isHandshake ? '/' : 'https://siasky.net/'
          );
        });
    },
    [sceneData]
  );
  return (
    <div className="px-4 py-4 h-14 border-b border-black flex place-content-between">
      {isEditingAction ? (
        <>
          <a
            href="https://kaboomjs.com/"
            target="_blank"
            className="text-blue-600"
          >
            Documentation
          </a>
          <a className="mx-4" onClick={handleDoneEditingAction}>
            <FontAwesomeIcon
              className={hasCodeChanges ? 'text-green-600 fill-current' : ''}
              icon={faCheck}
            />
          </a>
        </>
      ) : (
        <>
          <div>
            <a className="mr-4" onClick={handlePlayClick}>
              <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} />
            </a>
            <a className="mr-4" onClick={handleReloadClick}>
              <FontAwesomeIcon icon={faSync} />
            </a>
            <a
              className={
                'mr-4 ' +
                (hasChanges
                  ? ''
                  : ' cursor-default opacity-50 pointer-events-none select-none')
              }
              onClick={handleSaveClick}
            >
              <FontAwesomeIcon
                icon={isSaving ? faCircleNotch : faSave}
                spin={isSaving}
              />
            </a>
            <a className="mr-4" onClick={handleNewClick}>
              <FontAwesomeIcon icon={faFileMedical} />
            </a>
            <a className="mr-4" onClick={handleLoadClick}>
              <FontAwesomeIcon
                icon={isLoading ? faCircleNotch : faFolderOpen}
                spin={isLoading}
              />
            </a>
            <a className="mr-4" onClick={handleExportClick}>
              <FontAwesomeIcon icon={faFileExport} />
            </a>
            <span className="cursor-default">{currentFilename}</span>
          </div>
          {isLoggedIn ? null : (
            <a
              href="#"
              onClick={handleLoginClick}
              className={
                isPlaying
                  ? ' opacity-25 cursor-default pointer-events-none'
                  : ''
              }
            >
              Log in
            </a>
          )}
          {isLoggedIn ? (
            <a
              href="#"
              onClick={handleLoginClick}
              className={
                isPlaying
                  ? ' opacity-25 cursor-default pointer-events-none'
                  : ''
              }
            >
              Logout
            </a>
          ) : null}
        </>
      )}
    </div>
  );
};

export default TopBar;
