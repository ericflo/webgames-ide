import React, { useState, useCallback } from 'react';
import LayerChooser from './layerchooser';
import { Scene, GameObject, Layer, Component } from '../data';
import { API } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  scene: Scene;
  api: API;
  currentObject: GameObject;
  setCurrentObject: React.Dispatch<React.SetStateAction<[GameObject, string]>>;
  layerIndex: number;
  setLayerIndex: React.Dispatch<React.SetStateAction<number>>;
  onNewLayer: () => void;
  onDeleteLayer: (idx: number) => void;
};

const Objects = ({
  className,
  scene,
  api,
  currentObject,
  setCurrentObject,
  layerIndex,
  setLayerIndex,
  onNewLayer,
  onDeleteLayer,
}: Props) => {
  if (!scene) {
    return null;
  }
  const gameObjects = scene.layers[layerIndex].gameObjects || [];
  const onLayerChange = useCallback(
    (name: string) => {
      setLayerIndex(
        Math.max(
          scene.layers.findIndex((l: Layer) => l.name == name),
          0
        )
      );
      setCurrentObject([null, '']);
    },
    [scene, currentObject]
  );
  const handleClick = useCallback(
    (gameObject: GameObject, i: number, ev: React.MouseEvent) => {
      setCurrentObject(
        currentObject == gameObject
          ? [null, '']
          : [gameObject, 'Component ' + (i + 1)]
      );
    },
    [currentObject]
  );
  return (
    <div className={className}>
      <div className="flex">
        <h3 className="flex-none mx-4 font-light text-black text-opacity-70 w-14 self-center">
          Objects
        </h3>
        <LayerChooser
          className="flex-1"
          layerNames={scene.layers.map((layer: Layer) => layer.name)}
          layerIndex={layerIndex}
          onChange={onLayerChange}
          onNew={onNewLayer}
          onDelete={onDeleteLayer.bind(null, layerIndex)}
        />
      </div>
      <ul className="flex-1 overflow-y-scroll overflow-x-hide">
        {gameObjects.map((gameObject: GameObject, i: number) => {
          return (
            <li
              key={i}
              onClick={handleClick.bind(null, gameObject, i)}
              className={
                'px-4 py-2 cursor-pointer select-none ' +
                (gameObject == currentObject ? 'bg-blue-200' : '')
              }
            >
              <FontAwesomeIcon icon={faChevronCircleRight} /> Component {i + 1}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Objects;
