import React, { useState, useCallback } from 'react';
import LayerChooser from './layerchooser';
import { Scene, GameObject, Layer, Component } from '../data';
import { API } from '../api';

type Props = {
  className?: string;
  scene: Scene;
  api: API;
};

const Objects = ({ className, scene, api }: Props) => {
  if (!scene) {
    return null;
  }
  const [layerIndex, setLayerIndex] = useState(0);
  const gameObjects = scene.layers[layerIndex].gameObjects;
  const onLayerChange = useCallback(
    (name: string) => {
      setLayerIndex(
        Math.max(
          scene.layers.findIndex((l: Layer) => l.name == name),
          0
        )
      );
    },
    [scene]
  );
  return (
    <div className={className}>
      <div className="flex">
        <h3 className="flex-none m-2 font-light text-black text-opacity-70 w-14">
          Objects
        </h3>
        <LayerChooser
          className="flex-1"
          layerNames={scene.layers.map((layer: Layer) => layer.name)}
          onChange={onLayerChange}
        />
      </div>
      <ul>
        {gameObjects.map((gameObject: GameObject, i: number) => {
          return (
            <li key={i}>
              [
              {gameObject.components
                .map((comp: Component) => comp.type)
                .join(', ')}
              ]
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Objects;
