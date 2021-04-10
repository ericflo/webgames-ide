import React from 'react';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets from './ide/assets';
import Console from './ide/console';

const IDE = () => (
  <div className="flex flex-col h-screen w-screen ">
    <div className="flex flex-row flex-1">
      <div className="flex flex-col flex-1 max-w-xs">
        <SceneChooser
          className="flex-none bg-purple-500"
          sceneNames={['main']}
          onChange={(name: string) => console.log(name)} />
        <Objects className="flex-1 bg-yellow-500" />
        <Assets className="flex-1 bg-red-500" />
      </div>
      <Editor className="flex-1 bg-blue-500" />
    </div>
    <Console className="flex-none h-36 bg-green-500" />
  </div>
);

export default IDE;