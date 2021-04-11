import React, { useState, useCallback } from 'react';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets from './ide/assets';
import Console from './ide/console';
import { makeDefaultSceneData, Scene } from './ide/data';
import { useAPI } from './api';

const IDE = () => {
  const [sceneData, setSceneData] = useState(makeDefaultSceneData());
  const api = useAPI();
  const scene = sceneData.scenes.find(
    (value: Scene): Boolean => {
      return value.name == sceneData.currentSceneName;
    }
  );
  const onSceneChanged = useCallback(
    (name: string) => {
      console.log('onSceneChanged', name);
      setSceneData({
        scenes: sceneData.scenes,
        currentSceneName: name,
      });
    },
    [sceneData]
  );
  const handleLoginClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      api.login();
    },
    [api]
  );
  const handleLogoutClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      api.logout();
    },
    [api]
  );
  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1 max-w-xs">
          <SceneChooser
            className="flex-none bg-purple-500"
            sceneNames={sceneData.scenes.map((scene: Scene) => scene.name)}
            onChange={onSceneChanged}
          />
          <Objects className="flex-1 bg-yellow-500" scene={scene} />
          <Assets className="flex-1 bg-red-500" />
        </div>
        <div className="flex flex-col flex-1">
          <div className="loginbar bg-green-200">
            {api.loggedIn ? null : (
              <a href="#" onClick={handleLoginClick}>
                Log in
              </a>
            )}
            {api.loggedIn ? (
              <a href="#" onClick={handleLogoutClick}>
                Logout
              </a>
            ) : null}
          </div>
          <Editor className="flex-1 bg-blue-500" />
        </div>
      </div>
      <Console className="flex-none h-36 bg-green-500" />
    </div>
  );
};

export default IDE;
