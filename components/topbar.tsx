import {
  faCheck,
  faPlay,
  faSave,
  faStop,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';

type Props = {
  isPlaying: boolean;
  isEditingAction: boolean;
  isLoggedIn: boolean;
  hasChanges: boolean;
  hasCodeChanges: boolean;
  onDoneEditingAction: (i: number) => void;
  onPlayClick: () => void;
  onReloadClick: () => void;
  onSaveClick: () => void;
  onLoginClick: (ev: React.MouseEvent) => void;
};

const TopBar = ({
  isPlaying,
  isEditingAction,
  isLoggedIn,
  hasChanges,
  hasCodeChanges,
  onDoneEditingAction,
  onPlayClick,
  onReloadClick,
  onSaveClick,
  onLoginClick,
}: Props) => {
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
          <button className="mx-4" onClick={onDoneEditingAction.bind(null, 0)}>
            <FontAwesomeIcon
              className={hasCodeChanges ? 'text-green-600 fill-current' : ''}
              icon={faCheck}
            />
          </button>
        </>
      ) : (
        <>
          <div>
            <button className="mr-4" onClick={(ev) => onPlayClick()}>
              <FontAwesomeIcon icon={isPlaying ? faStop : faPlay} />
            </button>
            <button className="mr-4" onClick={(e) => onReloadClick()}>
              <FontAwesomeIcon icon={faSync} />
            </button>
            <button
              className={
                'mr-4 ' + (hasChanges ? '' : ' cursor-default opacity-50')
              }
              onClick={(ev) => onSaveClick()}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
          {isLoggedIn ? null : (
            <a
              href="#"
              onClick={onLoginClick}
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
              onClick={onLoginClick}
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
