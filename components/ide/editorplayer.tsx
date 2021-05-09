import React, { useRef, useEffect, useCallback } from 'react';

import { isProd } from '../buildconfig';
import { SceneData } from '../data';

type Props = {
  className?: string;
  portalUrl: string;
  sceneData: SceneData;
  currentObjectIndex: number;
  isPlaying: boolean;
  reloadVersion: number;
  onUpdateCurrentObjectPos: (x: number, y: number) => void;
};

const EditorPlayer = ({
  className,
  portalUrl,
  sceneData,
  currentObjectIndex,
  isPlaying,
  reloadVersion,
  onUpdateCurrentObjectPos,
}: Props) => {
  if (!portalUrl) {
    return null;
  }

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && reloadVersion > 0) {
      iframeRef.current.contentWindow.location.reload();
    }
  }, [reloadVersion, iframeRef]);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    iframeRef.current.contentWindow.postMessage(
      { type: 'state.sceneData', data: sceneData },
      '*'
    );
  }, [iframeRef, sceneData]);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    iframeRef.current.contentWindow.postMessage(
      { type: 'state.isPlaying', data: isPlaying },
      '*'
    );
  }, [iframeRef, isPlaying]);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    console.log('setting current object index', currentObjectIndex);
    iframeRef.current.contentWindow.postMessage(
      { type: 'state.currentObjectIndex', data: currentObjectIndex },
      '*'
    );
  }, [iframeRef, currentObjectIndex]);

  const handleEditorMessage = useCallback(
    (ev: MessageEvent) => {
      if (!iframeRef.current) {
        return;
      }
      if (ev.data.type === 'request.state.sceneData') {
        iframeRef.current.contentWindow.postMessage(
          { type: 'state.sceneData', data: sceneData },
          '*'
        );
      } else if (ev.data.type === 'state.currentObject.pos') {
        const x: number = ev.data.x;
        const y: number = ev.data.y;
        onUpdateCurrentObjectPos(x, y);
      }
    },
    [iframeRef, sceneData, currentObjectIndex]
  );

  useEffect(() => {
    window.addEventListener('message', handleEditorMessage);
    return () => {
      window.removeEventListener('message', handleEditorMessage);
    };
  }, [handleEditorMessage]);

  return (
    <iframe
      className={className}
      ref={iframeRef}
      src={
        (isProd ? 'editorplayer.html' : '/editorplayer') +
        '?portalUrl=' +
        encodeURIComponent(portalUrl)
      }
    />
  );
};

export default EditorPlayer;
