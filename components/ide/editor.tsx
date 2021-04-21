import React, { useRef, useEffect, useState } from 'react';

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
  return (
    <iframe
      className={className}
      ref={iframeRef}
      src={isProd ? 'editor.html' : '/editor'}
    />
  );
};

export default Editor;
