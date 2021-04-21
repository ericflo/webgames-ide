import React, { useRef, useEffect, useCallback } from 'react';

import { isProd } from '../buildconfig';
import { SceneData } from '../data';

type Props = {
  className?: string;
  sceneData: SceneData;
};

const Editor = ({ className, sceneData }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }
    iframeRef.current.contentWindow.postMessage(
      { type: 'state.sceneData', data: sceneData },
      '*'
    );
  }, [iframeRef, sceneData]);

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
      src={isProd ? 'editor.html' : '/editor'}
    />
  );
};

export default Editor;
