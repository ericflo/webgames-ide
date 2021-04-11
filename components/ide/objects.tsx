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
      setLayerIndex(Math.max(scene.layers.findIndex((l: Layer) => l.name == name), 0));
    },
    [scene]
  );
  return (
    <div className={className}>
      <LayerChooser
        className="flex-none"
        layerNames={scene.layers.map((layer: Layer) => layer.name)}
        onChange={onLayerChange}
      />
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
