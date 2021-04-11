import React, { useState, useCallback } from 'react';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets from './ide/assets';
import Console from './ide/console';
import { Scene } from './data';
import { useAPI } from './api';

const IDE = () => {
  const api = useAPI();
  const scene = api.currentSceneData.scenes.find(
    (value: Scene): Boolean => {
      return value.name == api.currentSceneData.currentSceneName;
    }
  );
  const onSceneChanged = useCallback(
    (name: string) => {
      console.log('onSceneChanged', name);
      api.currentSceneData = {
        scenes: api.currentSceneData.scenes,
        currentSceneName: name,
      };
    },
    [api]
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
            sceneNames={api.currentSceneData.scenes.map(
              (scene: Scene) => scene.name
            )}
            onChange={onSceneChanged}
          />
          <Objects className="flex-1 bg-yellow-500" scene={scene} api={api} />
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
