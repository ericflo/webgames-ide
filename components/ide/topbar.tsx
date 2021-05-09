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
import { API, DATA_DOMAIN } from '../api';
import { isProd } from '../buildconfig';
import SceneData from '../data';

type Props = {
  api: API;
  portalUrl: string;
  isPlaying: boolean;
  isLoggedIn: boolean;
  isSaving: boolean;
  isLoading: boolean;
  hasChanges: boolean;
  currentFilename: string;
  sceneData: SceneData;
  onPlayClick: () => void;
  onReloadClick: () => void;
  onSaveClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
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
  portalUrl,
  isPlaying,
  isLoggedIn,
  isSaving,
  isLoading,
  hasChanges,
  currentFilename,
  sceneData,
  onPlayClick,
  onReloadClick,
  onSaveClick,
  onLoginClick,
  onLogoutClick,
  onNewClick,
  onLoadClick,
}: Props) => {
  const handlePlayClick = usePreventDefault(onPlayClick);
  const handleReloadClick = usePreventDefault(onReloadClick);
  const handleSaveClick = usePreventDefault(onSaveClick);
  const handleLoginClick = usePreventDefault(onLoginClick);
  const handleLogoutClick = usePreventDefault(onLogoutClick);
  const handleNewClick = usePreventDefault(onNewClick);
  const handleLoadClick = usePreventDefault(onLoadClick);
  const handleExportClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();

      const sd: SceneData = JSON.parse(JSON.stringify(sceneData));
      sd.currentSceneName = 'main';
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
    html, body, canvas, #player-iframe {
      padding: 0;
      margin: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: absolute;
      border: none;
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
    <script type="application/javascript">
      window.addEventListener('message', (ev) => {
        if (ev.data.type === 'request.state.sceneData') {
          document.getElementById('player-iframe').contentWindow.postMessage(
            { type: 'state.sceneData', data: '${window.btoa(
              JSON.stringify(sd)
            )}' },
            '*'
          );
        }
      });
      var playerIframe = document.createElement('iframe');
      document.body.appendChild(playerIframe);
      playerIframe.setAttribute('id', 'player-iframe');
      playerIframe.setAttribute('src', ${
        isProd
          ? "'https://" + DATA_DOMAIN + "' + document.location.hostname + '/player.html'"
          : '"http://localhost:3000/player"'
      } + '?referrer=' + encodeURIComponent(document.location.href));
    </script>
  </body>
</html>`,
              ],
              'index.html'
            ),
          },
          'game'
        )
        .then((resp) => {
          win.location.href = resp.skylink.replace('sia:', portalUrl);
          const uri = `${DATA_DOMAIN}/games/${api.currentFilename}`;
          api.mySky
            .getJSON(uri)
            .then((prev) => {
              const metadata = {
                type: 'PublishedGame',
                content: { link: resp.skylink },
                prev: prev?.dataLink,
                uri,
              };
              console.log('Recording new content...', metadata);
              api.contentRecord
                .recordNewContent({ skylink: resp.skylink, metadata })
                .then((curr) => {
                  console.log('Done recording new content.');
                });

              if (prev?.dataLink) {
                const metadata = {
                  type: 'Exported',
                  content: { link: portalUrl + prev.dataLink },
                  to: resp.skylink,
                  uri: uri,
                };
                console.log('Recording interaction...', metadata);
                api.contentRecord
                  .recordInteraction({ skylink: prev.dataLink, metadata })
                  .then((tmp) => {
                    console.log('Done recording export interaction.');
                  });
              }
            })
            .catch((err) => {
              console.log('Error getting prev: ', err);
              const metadata = {
                type: 'PublishedGame',
                content: { link: resp.skylink },
                prev: null,
                uri: uri,
              };
              console.log('Recording new content...', metadata);
              api.contentRecord.recordNewContent({
                skylink: resp.skylink,
                metadata,
              });
              console.log('Done.');
            });
        });
    },
    [sceneData, portalUrl]
  );
  return (
    <div className="px-4 py-4 h-14 border-b border-black flex place-content-between">
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
            isPlaying ? ' opacity-25 cursor-default pointer-events-none' : ''
          }
        >
          Log in
        </a>
      )}
      {isLoggedIn ? (
        <a
          href="#"
          onClick={handleLogoutClick}
          className={
            isPlaying ? ' opacity-25 cursor-default pointer-events-none' : ''
          }
        >
          Logout
        </a>
      ) : null}
    </div>
  );
};

export default TopBar;
