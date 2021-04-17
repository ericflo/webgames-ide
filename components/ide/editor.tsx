import React, { useRef, useEffect, useState } from 'react';

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
      src={'/editor?scenedata=' + encodedSceneData}
    />
  );
};

export default Editor;
