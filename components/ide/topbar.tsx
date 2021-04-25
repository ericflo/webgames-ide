import {
  faCheck,
  faCircleNotch,
  faPlay,
  faSave,
  faStop,
  faSync,
  faFileMedical,
  faFolderOpen,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';

type Props = {
  isPlaying: boolean;
  isEditingAction: boolean;
  isLoggedIn: boolean;
  isSaving: boolean;
  isLoading: boolean;
  hasChanges: boolean;
  hasCodeChanges: boolean;
  currentFilename: string;
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
  isPlaying,
  isEditingAction,
  isLoggedIn,
  isSaving,
  isLoading,
  hasChanges,
  hasCodeChanges,
  currentFilename,
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
