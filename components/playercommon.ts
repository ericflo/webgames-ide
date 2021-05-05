import SceneData, {
  Action,
  ActionType,
  Asset,
  AssetType,
  Component,
  ComponentAction,
  ComponentPos,
  ComponentRect,
  ComponentType,
  GameObject,
  GameScore,
  Layer,
  Scene,
} from './data';
import { isProd, isHandshake } from './buildconfig';
import { MySky } from 'skynet-js';
import { DATA_DOMAIN } from './api';

const registeredAssets: string[] = [];

export function clearAssets() {
  registeredAssets.length = 0;
}

function setupAssets(k: any, sceneData: SceneData): Promise<any> {
  const inFlight: Promise<any>[] = [];
  ((sceneData || {}).assets || []).forEach((asset: Asset) => {
    if (registeredAssets.includes(asset.name)) {
      return;
    }
    switch (asset.type) {
      case AssetType.Sound:
        inFlight.push(
          k.loadSound(
            asset.name,
            asset.skylink.replace(
              'sia:',
              isProd && isHandshake ? '/' : 'https://siasky.net/'
            )
          )
        );
        break;
      case AssetType.Sprite:
        inFlight.push(
          k.loadSprite(
            asset.name,
            asset.skylink.replace(
              'sia:',
              isProd && isHandshake ? '/' : 'https://siasky.net/'
            )
          )
        );
        break;
      case AssetType.Font:
        console.log('Fonts assets are not yet supported by this engine.');
        break;
    }

    registeredAssets.push(asset.name);
  });
  return Promise.all(inFlight);
}

function setupLayers(k: any, sceneData: SceneData) {
  const layerNames: string[] = [];
  ((sceneData || {}).scenes || []).forEach((scene: Scene) => {
    scene.layers.forEach((layer: Layer) => {
      if (!layerNames.includes(layer.name)) {
        layerNames.push(layer.name);
      }
    });
  });
  if (layerNames.length > 0) {
    k.layers(layerNames, layerNames.includes('obj') ? 'obj' : layerNames[0]);
  }
}

function setupScene(
  k: any,
  scene: Scene,
  isPlaying: boolean,
  currentObjectIndex: number,
  objectOffset: { x: number; y: number }
) {
  let skipIndex = 0;
  k.scene(scene.name, () => {
    if (isPlaying) {
      (scene.actions || []).forEach(setupAction.bind(null, k));
    } else {
      if (currentObjectIndex >= 0) {
        const components =
          scene.layers[0].gameObjects[currentObjectIndex].components;
        const cPos = components.find(
          (c) => c.type === ComponentType.Pos
        ) as ComponentPos;
        const cRect = components.find(
          (c) => c.type === ComponentType.Rect
        ) as ComponentRect;
        const offset = objectOffset ? objectOffset : { x: 0, y: 0 };
        k.loadSprite('__movetool__', '/movetool.png').then(() => {
          k.add([
            k.pos(
              cPos.x + offset.x + cRect.w * 0.5,
              cPos.y + offset.y + cRect.h * 0.5
            ),
            k.sprite('__movetool__'),
            k.origin('center'),
            '__movetool__',
          ]);
        });
      }
    }
    scene.layers
      .flatMap((layer: Layer): GameObject[] => {
        return layer.gameObjects;
      })
      .forEach((gameObject: GameObject, i: number) => {
        const objActions: ComponentAction[] = [];
        const obj = k.add(
          gameObject.components
            .map((component: Component) => {
              switch (component.type) {
                case ComponentType.Pos:
                  if (i === currentObjectIndex && objectOffset) {
                    return k.pos(
                      component.x + objectOffset.x,
                      component.y + objectOffset.y
                    );
                  } else {
                    return k.pos(component.x, component.y);
                  }
                case ComponentType.Scale:
                  return k.scale(component.x, component.y);
                case ComponentType.Rotate:
                  return k.rotate(component.angle);
                case ComponentType.Color:
                  return k.color(
                    component.r,
                    component.g,
                    component.b,
                    component.a
                  );
                case ComponentType.Sprite:
                  return k.sprite(component.id);
                case ComponentType.Text:
                  return k.text(component.text, component.size, {
                    width: component.width,
                  });
                case ComponentType.Rect:
                  return k.rect(component.w, component.h);
                case ComponentType.Area:
                  return k.area(
                    k.vec2(component.p1.x, component.p1.y),
                    k.vec2(component.p2.x, component.p2.y)
                  );
                case ComponentType.Body:
                  if (isPlaying) {
                    return k.body({
                      jumpForce: component.jumpForce,
                      maxVel: component.maxVel,
                    });
                  } else {
                    const tag = 'skip-tag-' + skipIndex;
                    skipIndex += 1;
                    return tag;
                  }
                case ComponentType.Solid:
                  return k.solid();
                case ComponentType.Origin:
                  if (
                    Math.abs(component.custom.x) > 0.001 ||
                    Math.abs(component.custom.y) > 0.001
                  ) {
                    return k.origin(
                      k.vec2(component.custom.x, component.custom.y)
                    );
                  }
                  return k.origin(component.name);
                case ComponentType.Tag:
                  return component.name;
                case ComponentType.Action:
                  objActions.push(component);
                  return null;
                default:
                  return null;
              }
            })
            .filter((elt) => !!elt)
        );
        if (isPlaying) {
          objActions.forEach((objAction: ComponentAction) => {
            const act = eval(objAction.code).bind(null, k, obj);
            obj.on(objAction.eventName, act);
          });
        }
      });
  });
}

function setupAction(k: any, action: Action) {
  const act = eval(action.code).bind(null, k);
  switch (action.type) {
    case ActionType.Action:
      if (action.tag) {
        k.action(action.tag, act);
      } else {
        k.action(act);
      }
      break;
    case ActionType.Render:
      if (action.tag) {
        k.render(action.tag, act);
      } else {
        k.render(act);
      }
      break;
    case ActionType.Collides:
      k.collides(action.tag, action.otherTag, act);
      break;
    case ActionType.Overlaps:
      k.overlaps(action.tag, action.otherTag, act);
      break;
    case ActionType.On:
      k.on(action.eventName, action.tag, act);
      break;
    case ActionType.KeyDown:
      k.keyDown(action.keyName, act);
      break;
    case ActionType.KeyPress:
      k.keyPress(action.keyName, act);
      break;
    case ActionType.KeyRelease:
      k.keyRelease(action.keyName, act);
      break;
    case ActionType.CharInput:
      k.charInput(act);
      break;
    case ActionType.MouseDown:
      k.mouseDown(act);
      break;
    case ActionType.MouseClick:
      k.mouseClick(act);
      break;
    case ActionType.MouseRelease:
      k.mouseRelease(act);
      break;
  }
}

function addExt(
  k: any,
  setLatestScore: React.Dispatch<React.SetStateAction<number>>
) {
  let latestScore: GameScore = null;
  k.ext = {
    mySky: null,
    skylink: '',
    data: {},
    scores: {
      submit: (score: number) => {
        setLatestScore(score);
        latestScore = {
          skylink: k.ext.skylink,
          ts: new Date().getTime(),
          score,
        };
      },
      load: (): Promise<GameScore[]> => {
        if (!k.ext.mySky || !k.ext.skylink) {
          return Promise.resolve([latestScore]);
        }
        return new Promise((resolve, reject) => {
          (k.ext.mySky as MySky)
            .getJSON(`${DATA_DOMAIN}/scores.json`)
            .then((resp) => {
              const scores: GameScore[] =
                resp && resp.data && resp.data.scores
                  ? (resp.data.scores as any[])
                  : [];
              if (latestScore) {
                let found = false;
                scores.forEach((s) => {
                  if (
                    s.score == latestScore.score &&
                    Math.abs(s.ts - latestScore.ts) < 1000
                  ) {
                    found = true;
                  }
                });
                if (!found) {
                  scores.push(latestScore);
                }
              }
              resolve(
                scores.filter((sc) => sc.skylink === (k.ext.skylink as string))
              );
            })
            .catch(reject);
        });
      },
    },
  };
}

export function create(
  setLatestScore: React.Dispatch<React.SetStateAction<number>>
): any {
  const canvas = document.querySelectorAll('canvas.game')[0];
  const k = (window as any).kaboom({ scale: 1, fullscreen: true, canvas });
  addExt(k, setLatestScore);
  return k;
}

export function setup(
  k: any,
  sceneData: SceneData,
  isPlaying: boolean,
  currentObjectIndex: number,
  objectOffset: { x: number; y: number }
) {
  if (!sceneData || !k) {
    return;
  }
  const currentSceneName = sceneData.currentSceneName || 'main';

  k.go('tmpscene');

  setupLayers(k, sceneData);

  setupAssets(k, sceneData).then(() => {
    ((sceneData || {}).scenes || []).forEach((scene: Scene) => {
      setupScene(k, scene, isPlaying, currentObjectIndex, objectOffset);
      if (scene.name == currentSceneName) {
        k.go(scene.name);
      }
    });
  });
}
