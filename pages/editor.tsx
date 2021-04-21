import { useEffect, useState } from 'react';

import Head from 'next/head';

import SceneData, {
  Asset,
  Component,
  ComponentType,
  GameObject,
  Layer,
  Scene,
} from '../components/data';
import { isProd, isHandshake } from '../components/buildconfig';

let registeredAssets: string[] = [];

const Editor = () => {
  const [sceneData, setSceneData] = useState(null as SceneData);

  useEffect(() => {
    const k = (window as any).kaboom;
    console.log = function (...args: any[]) {
      window.top.postMessage({ type: 'console.log', args: args }, '*');
    };
    window.addEventListener('message', (ev: MessageEvent) => {
      if (ev.data.type === 'state.sceneData') {
        setSceneData(ev.data.data);
      }
    });
    k.init({
      fullscreen: true,
      scale: 2,
    });
    k.scene('tmpscene', () => {});
    k.start('tmpscene');
    window.top.postMessage({ type: 'request.state.sceneData' }, '*');
  }, []);

  useEffect(() => {
    if (!sceneData) {
      return;
    }

    const k = (window as any).kaboom;

    k.go('tmpscene');

    let loadedSprite = false;
    ((sceneData || {}).assets || []).forEach((asset: Asset) => {
      if (registeredAssets.includes(asset.name)) {
        return;
      }
      console.log(
        'Loading sprite',
        asset.name,
        'from',
        asset.skylink.replace(
          'sia:',
          isProd && isHandshake ? '/' : 'https://siasky.net/'
        )
      );
      k.loadSprite(
        asset.name,
        asset.skylink.replace(
          'sia:',
          isProd && isHandshake ? '/' : 'https://siasky.net/'
        )
      );
      loadedSprite = true;
      registeredAssets.push(asset.name);
    });

    setTimeout(
      () => {
        const layerNames: string[] = [];
        ((sceneData || {}).scenes || []).forEach((scene: Scene) => {
          scene.layers.forEach((layer: Layer) => {
            if (!layerNames.includes(layer.name)) {
              layerNames.push(layer.name);
            }
          });
        });
        if (layerNames.length > 0) {
          const defaultLayer = layerNames.includes('obj')
            ? 'obj'
            : layerNames[0];
          k.layers(layerNames, defaultLayer);
        }

        ((sceneData || {}).scenes || []).forEach((scene: Scene) => {
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
                        return k.body({
                          jumpForce: component.jumpForce,
                          maxVel: component.maxVel,
                        });
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
        });

        k.go(sceneData.currentSceneName || 'main');
      },
      loadedSprite ? 1000 : 0
    );
  }, [sceneData]);
  return (
    <>
      <Head>
        <title>WebGame</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kaboomjs.com/lib/0.3.0/kaboom.js"></script>
      </Head>
    </>
  );
};

export default Editor;
