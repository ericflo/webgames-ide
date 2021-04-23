import React, { useRef, useEffect, useCallback } from 'react';

import { isProd } from '../buildconfig';
import { SceneData } from '../data';

type Props = {
  className?: string;
  sceneData: SceneData;
  isPlaying: boolean;
  reloadVersion: number;
};

const EditorPlayer = ({
  className,
  sceneData,
  isPlaying,
  reloadVersion,
}: Props) => {
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
      }
    },
    [iframeRef, sceneData]
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
      src={isProd ? 'editorplayer.html' : '/editorplayer'}
    />
  );
};

export default EditorPlayer;
