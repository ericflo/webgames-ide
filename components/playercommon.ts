import SceneData, {
  Action,
  ActionType,
  Asset,
  Component,
  ComponentType,
  GameObject,
  Layer,
  Scene,
} from './data';
import { isProd, isHandshake } from './buildconfig';

const registeredAssets: string[] = [];

export function clearAssets() {
  registeredAssets.length = 0;
}

function setupAssets(k: any, sceneData: SceneData): Promise<any> {
  const spritesLoading: Promise<any /*{tex, frames, anims}*/>[] = [];
  ((sceneData || {}).assets || []).forEach((asset: Asset) => {
    if (registeredAssets.includes(asset.name)) {
      return;
    }
    spritesLoading.push(
      k.loadSprite(
        asset.name,
        asset.skylink.replace(
          'sia:',
          isProd && isHandshake ? '/' : 'https://siasky.net/'
        )
      )
    );
    registeredAssets.push(asset.name);
  });
  return Promise.all(spritesLoading);
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

function setupScene(k: any, scene: Scene, isPlaying: boolean) {
  let skipIndex = 0;
  k.scene(scene.name, () => {
    scene.layers
      .flatMap((layer: Layer): GameObject[] => {
        return layer.gameObjects;
      })
      .forEach((gameObject: GameObject, i: number) => {
        k.add(
          gameObject.components.map((component: Component) => {
            switch (component.type) {
              case ComponentType.Pos:
                return k.pos(component.x, component.y);
              case ComponentType.Scale:
                return k.scale(component.x, component.y);
              case ComponentType.Rotate:
                return k.scale(component.angle);
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
              case ComponentType.Layer:
                return k.layer(component.name);
              case ComponentType.Tag:
                return component.name;
            }
          })
        );
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
      k.overlaps(action.eventName, action.tag, act);
      break;
  }
}

export function create(): any {
  return (window as any).kaboom({ fullscreen: true, scale: 1 });
}

export function setup(k: any, sceneData: SceneData, isPlaying: boolean) {
  if (!sceneData || !k) {
    return;
  }

  k.go('tmpscene');

  setupLayers(k, sceneData);

  setupAssets(k, sceneData).then(() => {
    const currentSceneName = sceneData.currentSceneName || 'main';
    ((sceneData || {}).scenes || []).forEach((scene: Scene) => {
      setupScene(k, scene, isPlaying);
      if (scene.name == currentSceneName) {
        k.go(scene.name);
        if (isPlaying) {
          scene.actions.forEach(setupAction.bind(null, k));
        }
      }
    });
  });
}
