import React, { useState, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets, { useOnAssetDrop } from './ide/assets';
import Console from './ide/console';
import Meta from './ide/meta';
import { Scene, Asset, GameObject, DEFAULT_GAME_OBJECT } from './data';
import { useAPI } from './api';

const IDE = () => {
  const api = useAPI();
  const scene = api.currentSceneData.scenes.find(
    (value: Scene): Boolean => {
      return value.name == api.currentSceneData.currentSceneName;
    }
  );

  const [isUploading, setIsUploading] = useState(false);
  const [layerIndex, setLayerIndex] = useState(0);
  const [addAssetModalActive, setAddAssetModalActive] = useState(false);
  const [[currentObject, currentObjectTitle], setCurrentObject] = useState([
    null as GameObject,
    '',
  ]);
  const handleDeleteObject = useCallback(() => {
    const gameObjects = scene.layers[layerIndex].gameObjects;
    const idx = gameObjects.indexOf(currentObject);
    if (idx >= 0) {
      gameObjects.splice(idx, 1);
      api.saveCurrentSceneData();
    }
  }, [api, currentObject, layerIndex]);
  const handleAddObject = useCallback(() => {
    const gameObjects = scene.layers[layerIndex].gameObjects;
    const newObject = Object.assign({}, DEFAULT_GAME_OBJECT);
    gameObjects.push(newObject);
    setCurrentObject([newObject, 'Component ' + gameObjects.length]);
    api.saveCurrentSceneData();
  }, [scene, layerIndex]);
  const handleRequestNewScene = useCallback(() => {
    const name = prompt('New scene name');
    if (name && name.length > 0) {
      const tmp = api.currentSceneData;
      tmp.scenes.push({
        name,
        layers: [
          { name: 'obj', gameObjects: [] },
          { name: 'bg', gameObjects: [] },
          { name: 'ui', gameObjects: [] },
        ],
      });
      tmp.currentSceneName = name;
      api.currentSceneData = tmp;
      api.saveCurrentSceneData();
    }
  }, [api]);
  const handleSceneChanged = useCallback(
    (name: string) => {
      const tmp = api.currentSceneData;
      tmp.currentSceneName = name;
      api.currentSceneData = tmp;
    },
    [api]
  );
  const handleDeleteScene = useCallback(() => {
    if (
      confirm(
        'Are you sure you want to delete scene ' +
          api.currentSceneData.currentSceneName +
          '?'
      )
    ) {
      const tmp = api.currentSceneData;
      const scenes: Scene[] = [];
      tmp.scenes.forEach((scene: Scene) => {
        if (scene.name != tmp.currentSceneName) {
          scenes.push(scene);
        }
      });
      tmp.scenes = scenes;
      tmp.currentSceneName = tmp.scenes[0].name;
      api.currentSceneData = tmp;
      api.saveCurrentSceneData();
    }
  }, [api]);
  const handleNewLayer = useCallback(() => {
    const name = prompt('New layer name');
    if (name && name.length > 0) {
      scene.layers.push({ name, gameObjects: [] });
      setLayerIndex(scene.layers.length - 1);
      api.saveCurrentSceneData();
    }
  }, [api]);
  const handleDeleteLayer = useCallback(
    (idx: number) => {
      if (
        confirm(
          'Are you sure you want to delete layer ' +
            scene.layers[idx].name +
            '?'
        )
      ) {
        scene.layers.splice(idx, 1);
        setLayerIndex(0);
        api.saveCurrentSceneData();
      }
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
  const handleAssetDelete = useCallback(
    (asset: Asset) => {
      const sceneData = api.currentSceneData;
      sceneData.assets = api.currentSceneData.assets || [];
      let nextAssets: Asset[] = [];
      sceneData.assets.forEach((a: Asset) => {
        if (a.skylink != asset.skylink) {
          nextAssets.push(a);
        }
      });
      sceneData.assets = nextAssets;
      api.currentSceneData = sceneData;
      api.saveCurrentSceneData();
    },
    [api]
  );
  const handleDrop = useOnAssetDrop(
    api,
    setIsUploading,
    setAddAssetModalActive
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
  });
  return (
    <div className="flex flex-col h-screen w-screen" {...getRootProps()}>
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1 max-w-xs">
          <SceneChooser
            className="flex-none bg-purple-500"
            currentSceneName={api.currentSceneData.currentSceneName}
            sceneNames={api.currentSceneData.scenes.map(
              (scene: Scene) => scene.name
            )}
            onChange={handleSceneChanged}
            onNew={handleRequestNewScene}
            onDelete={handleDeleteScene}
          />
          <Objects
            className="flex flex-col flex-1 bg-yellow-500 max-h-72"
            scene={scene}
            api={api}
            currentObject={currentObject}
            setCurrentObject={setCurrentObject}
            onDeleteObject={handleDeleteObject}
            onAddObject={handleAddObject}
            layerIndex={layerIndex}
            setLayerIndex={setLayerIndex}
            onNewLayer={handleNewLayer}
            onDeleteLayer={handleDeleteLayer}
          />
          <Assets
            className="flex-1 bg-red-500 max-h-72"
            assets={api.currentSceneData.assets || []}
            onAssetDelete={handleAssetDelete}
            isUploading={isUploading}
            addAssetModalActive={addAssetModalActive}
            setAddAssetModalActive={setAddAssetModalActive}
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="loginbar bg-green-200 px-4 py-2">
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
          <div className="flex-1 flex flex-row">
            <Editor className="flex-1 bg-gray-300" />
            {currentObject ? (
              <Meta
                className="bg-gray-100 w-80"
                gameObject={currentObject}
                title={currentObjectTitle}
              />
            ) : null}
          </div>
        </div>
      </div>
      <Console className="flex-none h-36 bg-green-500" />
      <input {...getInputProps()} />
    </div>
  );
};

export default IDE;
