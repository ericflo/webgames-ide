import React, { useState, useCallback, useEffect } from 'react';

import { useDropzone } from 'react-dropzone';

import EditorPlayer from './ide/editorplayer';
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
  Layer,
  ComponentType,
  ActionType,
  makeDefaultSceneData,
  GameObject,
  ComponentAction,
} from './data';
import { useAPI } from './api';
import TopBar from './ide/topbar';
import LoadModal from './ide/loadmodal';
import CodeEditor from './ide/codeeditor';
import { cleanPortalUrl } from './buildconfig';

const IDE = () => {
  const api = useAPI();
  const [portalUrl, setPortalUrl] = useState(null as string);
  const [scene, _] = findScene(
    api.currentSceneData,
    api.currentSceneData.currentSceneName
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingLoadingModal, setIsShowingLoadingModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [layerIndex, setLayerIndex] = useState(0);
  const [addAssetModalActive, setAddAssetModalActive] = useState(false);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(-1);
  const [editingActionIndex, setEditingActionIndex] = useState(-1);
  const [
    editingComponentActionIndex,
    setEditingComponentActionIndex,
  ] = useState(-1);
  const [reloadVersion, setReloadVersion] = useState(0);
  const gameObjects = scene.layers[layerIndex].gameObjects;
  const currentObject = gameObjects[currentObjectIndex];
  const tags = uniquify(tagsFromScene(scene));

  useEffect(() => {
    api.skynetClient.portalUrl().then((nextPortalUrl: string) => {
      nextPortalUrl = cleanPortalUrl(nextPortalUrl);
      console.log('Portal URL:', nextPortalUrl);
      setPortalUrl(nextPortalUrl);
    });
  }, []);

  const deselectAll = useCallback(() => {
    setIsPlaying(false);
    setAddAssetModalActive(false);
    setCurrentObjectIndex(-1);
    setEditingActionIndex(-1);
  }, []);

  const handleDeleteObject = useCallback(() => {
    if (currentObjectIndex >= 0) {
      api.setCurrentSceneData((sceneData: SceneData) => {
        const [scene, _] = findScene(sceneData, sceneData.currentSceneName);
        scene.layers[layerIndex].gameObjects.splice(currentObjectIndex, 1);
        return sceneData;
      });
      //api.saveCurrentSceneData('handleDeleteObject');
      setHasChanges(true);
    }
  }, [api, currentObjectIndex, layerIndex]);

  const handleObjectNameChange = useCallback(
    (name: string) => {
      api.setCurrentSceneData(
        (sceneData: SceneData): SceneData => {
          const [scene, _] = findScene(sceneData, sceneData.currentSceneName);
          const objs = scene.layers[layerIndex].gameObjects;
          const obj = objs[currentObjectIndex];
          obj.name = name;
          return sceneData;
        }
      );
      setHasChanges(true);
    },
    [layerIndex, currentObjectIndex]
  );

  const handleAddObject = useCallback(() => {
    const tmp = { nextLength: 0 };
    api.setCurrentSceneData((sceneData: SceneData) => {
      const [scene, _] = findScene(sceneData, sceneData.currentSceneName);
      const obj: GameObject = JSON.parse(JSON.stringify(DEFAULT_GAME_OBJECT));
      const objs = scene.layers[layerIndex].gameObjects;
      objs.push(obj);
      obj.name += ' ' + objs.length;
      tmp.nextLength = objs.length;
      return sceneData;
    });
    setCurrentObjectIndex(tmp.nextLength - 1);
    //api.saveCurrentSceneData('handleAddObject');
    setHasChanges(true);
  }, [scene, layerIndex, gameObjects]);

  const handleAddAction = useCallback(() => {
    api.setCurrentSceneData(
      (sceneData: SceneData): SceneData => {
        const [_, sceneIndex] = findScene(
          sceneData,
          sceneData.currentSceneName
        );
        sceneData.scenes[sceneIndex].actions.push(
          JSON.parse(JSON.stringify(DEFAULT_ACTION))
        );
        return sceneData;
      }
    );
    //api.saveCurrentSceneData('handleAddAction');
    setHasChanges(true);
  }, [api]);

  const handleDeleteAction = useCallback(
    (i: number) => {
      setEditingActionIndex(-1);
      api.setCurrentSceneData(
        (sceneData: SceneData): SceneData => {
          const [_, sceneIndex] = findScene(
            sceneData,
            sceneData.currentSceneName
          );
          const actions = sceneData.scenes[sceneIndex].actions;
          if (actions && actions.length > i) {
            actions.splice(i, 1);
          }
          return sceneData;
        }
      );
      //api.saveCurrentSceneData('handleDeleteAction');
      setHasChanges(true);
    },
    [api, setEditingActionIndex]
  );

  const handleChangeAction = useCallback(
    (i: number, action: Action) => {
      api.setCurrentSceneData(
        (sceneData: SceneData): SceneData => {
          const [_, sceneIndex] = findScene(
            sceneData,
            sceneData.currentSceneName
          );
          const actions = sceneData.scenes[sceneIndex].actions;
          if (actions && actions.length > i) {
            actions.splice(i, 1, JSON.parse(JSON.stringify(action)));
          }
          return sceneData;
        }
      );
      //api.saveCurrentSceneData('handleChangeAction');
      setHasChanges(true);
    },
    [api]
  );

  const handleEditAction = useCallback(
    (i: number) => {
      const isEditing = editingActionIndex >= 0;
      setEditingActionIndex(isEditing ? -1 : i);
      setIsPlaying(false);
    },
    [api, editingActionIndex]
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
            actions: [],
          });
          sd.currentSceneName = name;
          return sd;
        }
      );
      //api.saveCurrentSceneData('handleRequestNewScene');
      setHasChanges(true);
    }
  }, [api]);

  const handleSceneChanged = useCallback(
    (name: string) => {
      deselectAll();
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
      //api.saveCurrentSceneData('handleDeleteScene');
      setHasChanges(true);
    }
  }, [api]);

  const handleNewLayer = useCallback(() => {
    const name = prompt('New layer name');
    if (name && name.length > 0) {
      scene.layers.push({ name, gameObjects: [] });
      setLayerIndex(scene.layers.length - 1);
      //api.saveCurrentSceneData('handleNewLayer');
      setHasChanges(true);
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
        //api.saveCurrentSceneData('handleDeleteLayer');
        setHasChanges(true);
      }
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
      //api.saveCurrentSceneData('handleAssetDelete');
      setHasChanges(true);
    },
    [api]
  );

  const handleDrop = useOnAssetDrop(
    api,
    setIsUploading,
    setAddAssetModalActive,
    setHasChanges
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
    //api.saveCurrentSceneData('handleChangeComponent');
    setHasChanges(true);
  };

  const handleUpdateCurrentObjectPos = (x: number, y: number) => {
    api.setCurrentSceneData(
      (sd: SceneData): SceneData => {
        const obj = sd.scenes.find((s) => s.name == sd.currentSceneName).layers[
          layerIndex
        ].gameObjects[currentObjectIndex];
        (obj?.components || []).forEach((component: Component) => {
          if (component.type === ComponentType.Pos) {
            component.x += x;
            component.y += y;
          }
        });
        return sd;
      }
    );
    setHasChanges(true);
  };

  const handleStartCodeEditor = (i: number, component: Component) => {
    setEditingComponentActionIndex(i);
  };

  const handleSaveCodeEditor = useCallback(
    (code: string) => {
      api.setCurrentSceneData(
        (sd: SceneData): SceneData => {
          const [scn, _] = findScene(sd, sd.currentSceneName);
          if (editingComponentActionIndex >= 0) {
            const obj = scn.layers[layerIndex].gameObjects[currentObjectIndex];
            const component = obj.components[
              editingComponentActionIndex
            ] as ComponentAction;
            component.code = code;
            obj.components[editingComponentActionIndex] = component;
          } else {
            const action = scn.actions[editingActionIndex];
            if (action.code != code) {
              setTimeout(() => {
                setHasChanges(true);
              }, 50);
            }
            action.code = code;
          }
          return sd;
        }
      );
    },
    [
      api,
      layerIndex,
      editingActionIndex,
      editingComponentActionIndex,
      currentObjectIndex,
    ]
  );

  const handleCloseCodeEditor = useCallback(() => {
    setEditingActionIndex(-1);
    setEditingComponentActionIndex(-1);
  }, []);

  const handlePlayClick = useCallback(() => {
    deselectAll();
    setIsPlaying(!isPlaying);
  }, [isPlaying, editingActionIndex]);

  const handleSaveClick = useCallback(() => {
    if (!api.currentFilename) {
      let filename = prompt(
        'What should we name the file for this game project?',
        'MyGameName.json'
      );
      console.log('filename', filename, typeof filename);
      if (!filename || filename.length == 0) {
        alert(
          'A valid file name must be chosen in order to save this game project.'
        );
        return;
      }
      if (!filename.endsWith('.json')) {
        filename += '.json';
      }
      api.currentFilename = filename;
    }
    setHasChanges(false);
    api.saveCurrentSceneData('handleSaveClick');
  }, [api]);

  const handleNewClick = useCallback(() => {
    if (
      hasChanges &&
      !confirm(
        'Are you sure you want to start a new project? You have unsaved changes which will be lost.'
      )
    ) {
      return;
    }
    setHasChanges(false);
    deselectAll();
    api.currentFilename = '';
    api.setCurrentSceneData(
      (_: SceneData): SceneData => {
        return makeDefaultSceneData();
      }
    );
  }, [api, hasChanges]);

  const handleLoadClick = useCallback(() => {
    setIsShowingLoadingModal(!isShowingLoadingModal);
  }, [isShowingLoadingModal]);

  const handleLoadingModalBackgroundClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      setIsShowingLoadingModal(false);
    },
    []
  );

  let codeValue: string = '';
  if (editingActionIndex >= 0) {
    codeValue = scene.actions[editingActionIndex]?.code;
  } else if (editingComponentActionIndex >= 0 && currentObject) {
    codeValue = (currentObject.components[
      editingComponentActionIndex
    ] as ComponentAction)?.code;
    if (!codeValue) {
      codeValue = `(k, obj) => {
  //obj.move(k.vec2(750, 0));
}`;
    }
  }
  if (!codeValue) {
    const editingAction = scene.actions[editingActionIndex];
    switch (editingAction?.type) {
      case ActionType.Action:
      case ActionType.Render:
      case ActionType.On:
        if (editingAction.tag) {
          codeValue = `(k, ${editingAction.tag}) => {
  //${editingAction.tag}.move(k.vec2(750, 0));
}`;
        } else {
          codeValue = `(k) => {
  //k.get('tagname').move(k.vec2(750, 0));
}`;
        }
        break;
      case ActionType.Collides:
      case ActionType.Overlaps:
        codeValue = `(k, ${editingAction.tag}, ${editingAction.otherTag}) => {
  //k.destroy(${editingAction.otherTag});
  //${editingAction.tag || "k.get('tagname')"}.move(k.vec2(750, 0));
}`;
        break;
      case ActionType.KeyDown:
      case ActionType.KeyPress:
      case ActionType.KeyRelease:
      case ActionType.MouseDown:
      case ActionType.MouseClick:
      case ActionType.MouseRelease:
        codeValue = `(k) => {
  //k.get('tagname').move(k.vec2(750, 0));
}`;
        break;
      case ActionType.CharInput:
        codeValue = `(k, ch) => {
  //console.log('Typed:', ch);
}`;
        break;
      default:
        codeValue = `(k) => {
  //k.get('tagname').move(k.vec2(750, 0));
}`;
    }
  }

  useEffect(deselectAll, [reloadVersion]);

  return (
    <div className="h-screen w-screen" {...getRootProps()}>
      {isShowingLoadingModal ? (
        <LoadModal
          api={api}
          hasChanges={hasChanges}
          setHasChanges={setHasChanges}
          onClose={() => setIsShowingLoadingModal(false)}
        />
      ) : null}
      {editingActionIndex < 0 && editingComponentActionIndex < 0 ? null : (
        <CodeEditor
          initialValue={codeValue}
          onSave={handleSaveCodeEditor}
          onClose={handleCloseCodeEditor}
        />
      )}
      <div
        className={'flex flex-row' + (editingActionIndex < 0 ? '' : ' hidden')}
      >
        <div className="flex flex-col flex-none h-screen w-96">
          <SceneChooser
            className={
              'flex-none h-14 border-b border-r border-black ' +
              (isPlaying ? 'opacity-25 cursor-default pointer-events-none' : '')
            }
            currentSceneName={api.currentSceneData.currentSceneName}
            sceneNames={api.currentSceneData.scenes.map(
              (scene: Scene) => scene.name
            )}
            onChange={handleSceneChanged}
            onNew={handleRequestNewScene}
            onDelete={handleDeleteScene}
          />
          <Objects
            className={
              'flex-1 h-0 border-b border-r border-black ' +
              (isPlaying ? 'opacity-25 cursor-default pointer-events-none' : '')
            }
            scene={scene}
            api={api}
            currentObjectIndex={currentObjectIndex}
            setCurrentObjectIndex={setCurrentObjectIndex}
            onDeleteObject={handleDeleteObject}
            onAddObject={handleAddObject}
            layerIndex={layerIndex}
            setLayerIndex={(idx: number) => {
              deselectAll();
              setLayerIndex(idx);
            }}
            onNewLayer={handleNewLayer}
            onDeleteLayer={handleDeleteLayer}
          />
          <Assets
            className={
              'flex-1 h-0 border-r border-black ' +
              (isPlaying ? 'opacity-25 cursor-default pointer-events-none' : '')
            }
            portalUrl={portalUrl}
            assets={api.currentSceneData.assets || []}
            isUploading={isUploading}
            addAssetModalActive={addAssetModalActive}
            setAddAssetModalActive={setAddAssetModalActive}
            onAssetDelete={handleAssetDelete}
          />
          <Actions
            className={
              'flex-1 h-0 border-t border-b border-r border-black ' +
              (isPlaying ? 'opacity-25 cursor-default pointer-events-none' : '')
            }
            actions={scene?.actions || []}
            editingActionIndex={editingActionIndex}
            tags={tags}
            onAddAction={handleAddAction}
            onDeleteAction={handleDeleteAction}
            onChangeAction={handleChangeAction}
            onEditAction={handleEditAction}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <TopBar
            api={api}
            portalUrl={portalUrl}
            isPlaying={isPlaying}
            isLoggedIn={api.loggedIn}
            isSaving={api.saving}
            isLoading={api.loading}
            hasChanges={hasChanges}
            currentFilename={api.currentFilename}
            sceneData={api.currentSceneData}
            onPlayClick={handlePlayClick}
            onReloadClick={() => setReloadVersion((v) => v + 1)}
            onSaveClick={handleSaveClick}
            onLoginClick={api.login}
            onLogoutClick={api.logout}
            onNewClick={handleNewClick}
            onLoadClick={handleLoadClick}
          />
          <div className="flex-1 flex flex-row">
            <div
              className={
                (editingActionIndex >= 0 ? 'absolute' : '') +
                ' flex-1 flex flex-col'
              }
            >
              <EditorPlayer
                className="flex-1 bg-gray-300"
                sceneData={api.currentSceneData}
                currentObjectIndex={currentObjectIndex}
                isPlaying={isPlaying}
                reloadVersion={reloadVersion}
                onUpdateCurrentObjectPos={handleUpdateCurrentObjectPos}
              />
              <Console className="flex-none h-36" />
            </div>
            {currentObject && editingActionIndex < 0 ? (
              <Meta
                key={currentObjectIndex}
                className={
                  'w-80 flex-none overflow-hidden border-l border-black' +
                  (isPlaying
                    ? ' opacity-25 cursor-default pointer-events-none'
                    : '')
                }
                gameObject={currentObject}
                assets={api.currentSceneData.assets || []}
                onChangeComponent={handleChangeComponent}
                onStartCodeEditor={handleStartCodeEditor}
                onNameChange={handleObjectNameChange}
              />
            ) : null}
          </div>
        </div>
      </div>
      <input {...getInputProps()} />
    </div>
  );
};

function findScene(sceneData: SceneData, name: string): [Scene, number] {
  const scene = sceneData.scenes.find(
    (value: Scene): Boolean => {
      return value.name == name;
    }
  );
  const index = scene ? sceneData.scenes.indexOf(scene) : -1;
  return [scene, index];
}

function uniquify(strs: string[]): string[] {
  return strs.filter(
    (value: string, index: number, acc: string[]): Boolean => {
      return acc.indexOf(value) === index;
    }
  );
}

function tagsFromScene(scene: Scene): string[] {
  return scene.layers.flatMap((layer: Layer, j: number) => {
    return layer.gameObjects.flatMap((gameObject, k: number) => {
      return gameObject.components.flatMap(
        (component: Component, l: number) => {
          return component.type == ComponentType.Tag ? [component.name] : [];
        }
      );
    });
  });
}

export default IDE;
