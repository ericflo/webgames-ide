import React, { useRef, useEffect, useState } from 'react';

import { isProd } from '../buildconfig';
import { SceneData } from '../data';

type Props = {
  className?: string;
  sceneData: SceneData;
};

const Editor = ({ className, sceneData }: Props) => {
  const encodedSceneData = encodeURIComponent(JSON.stringify(sceneData));
  return (
    <iframe
      className={className}
      src={
        (isProd ? 'editor.html' : '/editor') + '?scenedata=' + encodedSceneData
      }
    />
  );
};

export default Editor;
