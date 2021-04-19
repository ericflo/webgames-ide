import React, { useState, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets, { useOnAssetDrop } from './ide/assets';
import Console from './ide/console';
import Meta from './ide/meta';
import SceneData, {
  Scene,
  Asset,
  Component,
  DEFAULT_GAME_OBJECT,
} from './data';
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
  const [currentObjectIndex, setCurrentObjectIndex] = useState(-1);
  const gameObjects = scene.layers[layerIndex].gameObjects;
  const currentObject = gameObjects[currentObjectIndex];
  const handleDeleteObject = useCallback(() => {
    const idx = gameObjects.indexOf(currentObject);
    if (idx >= 0) {
      gameObjects.splice(idx, 1);
      api.saveCurrentSceneData();
    }
  }, [api, currentObject, layerIndex]);
  const handleAddObject = useCallback(() => {
    const newObject = JSON.parse(JSON.stringify(DEFAULT_GAME_OBJECT));
    gameObjects.push(newObject);
    setCurrentObjectIndex(gameObjects.length - 1);
    api.saveCurrentSceneData();
  }, [scene, layerIndex, gameObjects]);
  const handleRequestNewScene = useCallback(() => {
    const name = prompt('New scene name');
    if (name && name.length > 0) {
      api.setCurrentSceneData(
        (sd: SceneData): SceneData => {
          sd.scenes.push({
            name,
            layers: [
              { name: 'obj', gameObjects: [] },
              { name: 'bg', gameObjects: [] },
              { name: 'ui', gameObjects: [] },
            ],
          });
          sd.currentSceneName = name;
          return sd;
        }
      );
      api.saveCurrentSceneData();
    }
  }, [api]);
  const handleSceneChanged = useCallback(
    (name: string) => {
      api.setCurrentSceneData(
        (sd: SceneData): SceneData => {
          sd.currentSceneName = name;
          return sd;
        }
      );
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
      api.setCurrentSceneData(
        (sd: SceneData): SceneData => {
          const scenes: Scene[] = [];
          sd.scenes.forEach((scene: Scene) => {
            if (scene.name != sd.currentSceneName) {
              scenes.push(scene);
            }
          });
          sd.scenes = scenes;
          sd.currentSceneName = sd.scenes[0].name;
          return sd;
        }
      );
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
      api.setCurrentSceneData(
        (sceneData: SceneData): SceneData => {
          let nextAssets: Asset[] = [];
          (sceneData.assets || []).forEach((a: Asset) => {
            if (a.skylink != asset.skylink) {
              nextAssets.push(a);
            }
          });
          sceneData.assets = nextAssets;
          return sceneData;
        }
      );
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
  const handleChangeComponent = useCallback(
    (i: number, component: Component) => {
      api.setCurrentSceneData(
        (sd: SceneData): SceneData => {
          const obj = sd.scenes.find(
            (value: Scene): Boolean => {
              return value.name == sd.currentSceneName;
            }
          ).layers[layerIndex].gameObjects[currentObjectIndex];
          if (component) {
            obj.components[i] = component;
          } else {
            obj.components.splice(i, 1);
          }
          return sd;
        }
      );
      api.saveCurrentSceneData();
    },
    [api, layerIndex, currentObjectIndex]
  );
  return (
    <div className="flex flex-col h-screen w-screen" {...getRootProps()}>
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1 max-w-xs">
          <SceneChooser
            className="flex-none h-14 border-b border-r border-black"
            currentSceneName={api.currentSceneData.currentSceneName}
            sceneNames={api.currentSceneData.scenes.map(
              (scene: Scene) => scene.name
            )}
            onChange={handleSceneChanged}
            onNew={handleRequestNewScene}
            onDelete={handleDeleteScene}
          />
          <Objects
            className="flex flex-col flex-1 max-h-72 border-b border-r border-black"
            scene={scene}
            api={api}
            currentObjectIndex={currentObjectIndex}
            setCurrentObjectIndex={setCurrentObjectIndex}
            onDeleteObject={handleDeleteObject}
            onAddObject={handleAddObject}
            layerIndex={layerIndex}
            setLayerIndex={setLayerIndex}
            onNewLayer={handleNewLayer}
            onDeleteLayer={handleDeleteLayer}
          />
          <Assets
            className="flex-1 max-h-72 border-r border-black"
            assets={api.currentSceneData.assets || []}
            onAssetDelete={handleAssetDelete}
            isUploading={isUploading}
            addAssetModalActive={addAssetModalActive}
            setAddAssetModalActive={setAddAssetModalActive}
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="loginbar px-4 py-4 h-14 border-b border-black">
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
            <Editor
              className="flex-1 bg-gray-300"
              sceneData={api.currentSceneData}
            />
            {currentObject ? (
              <Meta
                className="w-80 border-l border-black"
                gameObject={currentObject}
                title={'Game Object ' + (currentObjectIndex + 1)}
                onChangeComponent={handleChangeComponent}
              />
            ) : null}
          </div>
        </div>
      </div>
      <Console className="flex-none h-36 border-t border-black" />
      <input {...getInputProps()} />
    </div>
  );
};

export default IDE;
