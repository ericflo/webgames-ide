import React, { useState, useCallback } from 'react';
import LayerChooser from './layerchooser';
import { Scene, GameObject, Layer, Component } from '../data';
import { API } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronCircleRight,
  faPlusSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  scene: Scene;
  api: API;
  currentObjectIndex: number;
  setCurrentObjectIndex: React.Dispatch<React.SetStateAction<number>>;
  onDeleteObject: () => void;
  onAddObject: () => void;
  layerIndex: number;
  setLayerIndex: React.Dispatch<React.SetStateAction<number>>;
  onNewLayer: () => void;
  onDeleteLayer: (idx: number) => void;
};

const Objects = ({
  className,
  scene,
  api,
  currentObjectIndex,
  setCurrentObjectIndex,
  onDeleteObject,
  onAddObject,
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
      setCurrentObjectIndex(-1);
    },
    [scene, currentObjectIndex]
  );
  const handleClick = useCallback(
    (gameObject: GameObject, i: number, ev: React.MouseEvent) => {
      if (ev.defaultPrevented) {
        return;
      }
      setCurrentObjectIndex(currentObjectIndex == i ? -1 : i);
    },
    [currentObjectIndex]
  );
  const handleAddObjectClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      onAddObject();
    },
    [onAddObject]
  );
  const handleDeleteClick = useCallback(
    (i: number, ev: React.MouseEvent) => {
      ev.preventDefault();
      if (
        confirm('Are you sure you want to delete Game Object ' + (i + 1) + '?')
      ) {
        onDeleteObject();
      }
    },
    [currentObjectIndex]
  );
  return (
    <div className={className + ' flex flex-col relative'}>
      <div className="flex">
        <h3 className="flex-none mx-4 font-light text-black text-opacity-70 w-14 self-center select-none">
          Objects
        </h3>
        <LayerChooser
          className="flex-none"
          layerNames={scene.layers.map((layer: Layer) => layer.name)}
          layerIndex={layerIndex}
          onChange={onLayerChange}
          onNew={onNewLayer}
          onDelete={onDeleteLayer.bind(null, layerIndex)}
        />
      </div>
      <ul className="overflow-y-scroll overflow-x-hide">
        {gameObjects.map((gameObject: GameObject, i: number) => {
          const isSelected = i == currentObjectIndex;
          return (
            <li
              key={i}
              onClick={handleClick.bind(null, gameObject, i)}
              className={
                'px-4 py-2 cursor-pointer select-none ' +
                (isSelected ? 'bg-blue-200' : '')
              }
            >
              <FontAwesomeIcon icon={faChevronCircleRight} /> Game Object{' '}
              {i + 1}
              {isSelected ? (
                <span
                  className="float-right"
                  onClick={handleDeleteClick.bind(null, i)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
      <button
        className="absolute bottom-3 left-3 bg-white bg-opacity-60 w-10 h-10 rounded-full border border-gray-500 shadow-2xl"
        onClick={handleAddObjectClick}
      >
        <FontAwesomeIcon icon={faPlusSquare} className="text-gray-800" />
      </button>
    </div>
  );
};

export default Objects;
