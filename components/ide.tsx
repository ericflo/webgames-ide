import React, { useState, useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import Editor from './ide/editor';
import SceneChooser from './ide/scenechooser';
import Objects from './ide/objects';
import Assets, { useOnAssetDrop } from './ide/assets';
import Actions from './ide/actions';
import Console from './ide/console';
import Meta from './ide/meta';
import SceneData, {
  Scene,
  Asset,
  Component,
  DEFAULT_GAME_OBJECT,
  DEFAULT_ACTION,
  Action,
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
    gameObjects.push(JSON.parse(JSON.stringify(DEFAULT_GAME_OBJECT)));
    setCurrentObjectIndex(gameObjects.length - 1);
    api.saveCurrentSceneData();
  }, [scene, layerIndex, gameObjects]);

  const handleAddAction = useCallback(() => {
    api.setCurrentSceneData(
      (sceneData: SceneData): SceneData => {
        if (!sceneData.actions) {
          sceneData.actions = [];
        }
        sceneData.actions.push(JSON.parse(JSON.stringify(DEFAULT_ACTION)));
        return sceneData;
      }
    );
    api.saveCurrentSceneData();
  }, [api]);

  const handleDeleteAction = useCallback(
    (i: number) => {
      api.setCurrentSceneData(
        (sceneData: SceneData): SceneData => {
          if (!sceneData.actions || sceneData.actions.length <= i) {
            return;
          }
          sceneData.actions.splice(i, 1);
          return sceneData;
        }
      );
      api.saveCurrentSceneData();
    },
    [api]
  );

  const handleChangeAction = useCallback(
    (i: number, action: Action) => {
      api.setCurrentSceneData(
        (sceneData: SceneData): SceneData => {
          const resp = { ...sceneData };
          resp.actions = (resp.actions || []).map(
            (act: Action, j: number): Action => {
              return j == i ? JSON.parse(JSON.stringify(action)) : act;
            }
          );
          return resp;
        }
      );
      api.saveCurrentSceneData();
    },
    [api]
  );

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

  const handleChangeComponent = (i: number, component: Component) => {
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
  };

  return (
    <div className="h-screen w-screen" {...getRootProps()}>
      <div className="flex flex-row">
        <div className="flex flex-col flex-none h-screen max-w-xs w-80">
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
            className="flex-1 h-0 border-b border-r border-black"
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
            className="flex-1 h-0 border-r border-black"
            assets={api.currentSceneData.assets || []}
            onAssetDelete={handleAssetDelete}
            isUploading={isUploading}
            addAssetModalActive={addAssetModalActive}
            setAddAssetModalActive={setAddAssetModalActive}
          />
          <Actions
            className="flex-1 h-0 border-t border-b border-r border-black"
            actions={api.currentSceneData.actions || []}
            onAddAction={handleAddAction}
            onDeleteAction={handleDeleteAction}
            onChangeAction={handleChangeAction}
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
            <div className="flex-1 flex flex-col">
              <Editor
                className="flex-1 bg-gray-300"
                sceneData={api.currentSceneData}
              />
              <Console className="flex-none h-36" />
            </div>
            {currentObject ? (
              <Meta
                key={currentObjectIndex}
                className="w-80 flex-none overflow-hidden border-l border-black"
                gameObject={currentObject}
                assets={api.currentSceneData.assets || []}
                title={'Game Object ' + (currentObjectIndex + 1)}
                onChangeComponent={handleChangeComponent}
              />
            ) : null}
          </div>
        </div>
      </div>
      <input {...getInputProps()} />
    </div>
  );
};

export default IDE;
