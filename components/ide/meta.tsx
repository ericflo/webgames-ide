import React, { useCallback, useState } from 'react';

import {
  Asset,
  GameObject,
  Component,
  ComponentType,
  defaultComponentForType,
  componentTypeName,
} from '../data';

import MetaComponent from './metacomponent';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

type Props = {
  className?: string;
  gameObject: GameObject;
  assets: Asset[];
  title: string;
  onChangeComponent: (i: number, component: Component) => void;
};

const Meta = ({
  className,
  gameObject,
  assets,
  title,
  onChangeComponent,
}: Props) => {
  const [addComponentModalActive, setAddComponentModalActive] = useState(false);

  const handleAddComponentClick = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    setAddComponentModalActive(true);
  }, []);

  const handleClick = useCallback((ev: React.MouseEvent) => {
    if (!ev.defaultPrevented) {
      setAddComponentModalActive(false);
    }
  }, []);

  const handleAddClick = useCallback(
    (componentType: ComponentType, ev: React.MouseEvent) => {
      //ev.preventDefault();
      gameObject.components.push(defaultComponentForType(componentType));
    },
    [gameObject]
  );

  const handleDeleteComponent = useCallback((i: number) => {
    //ev.preventDefault();
    onChangeComponent(i, null);
    //gameObject.components.splice(i, 1);
  }, []);

  const componentTypes = [
    ComponentType.Pos,
    ComponentType.Scale,
    ComponentType.Rotate,
    ComponentType.Color,
    ComponentType.Sprite,
    ComponentType.Text,
    ComponentType.Rect,
    ComponentType.Area,
    ComponentType.Body,
    ComponentType.Solid,
    ComponentType.Origin,
    ComponentType.Layer,
    ComponentType.Tag,
  ];

  gameObject.components.forEach((component: Component) => {
    switch (component.type) {
      case ComponentType.Layer:
      case ComponentType.Tag:
        break;
      default:
        componentTypes.splice(componentTypes.indexOf(component.type), 1);
        break;
    }
  });

  return (
    <div
      className={className + ' flex flex-col relative'}
      onClick={handleClick}
    >
      {addComponentModalActive ? (
        <div className="absolute w-full h-full bg-black bg-opacity-80 flex flex-col place-content-center place-items-center z-10">
          <ul>
            {componentTypes.map((componentType: ComponentType, i: number) => {
              return (
                <li key={componentType + '.' + i}>
                  <button
                    className="h-8 w-48 bg-white display-block rounded-md text-black font-light border-2 border-black"
                    onClick={handleAddClick.bind(null, componentType)}
                  >
                    {componentTypeName(componentType)}
                  </button>
                </li>
              );
            })}
          </ul>
          <button className="w-48 h-12 mt-1 bg-gray-400 display-block rounded-md text-black border-2 border-gray-300 font-bold">
            Cancel
          </button>
        </div>
      ) : null}
      <h3 className="flex-none mx-4 my-2 font-light text-black text-opacity-70">
        Meta
        <span className="float-right">{title}</span>
      </h3>
      <div className="flex-grow overflow-scroll h-0">
        {gameObject.components.map((component: Component, i: number) => {
          return (
            <MetaComponent
              key={'' + i + '.' + component.type}
              gameObject={gameObject}
              component={component}
              assets={assets}
              onChange={onChangeComponent.bind(null, i)}
              onDelete={handleDeleteComponent.bind(null, i)}
            />
          );
        })}
      </div>
      {addComponentModalActive ? null : (
        <button
          className="absolute bottom-3 left-3 bg-white bg-opacity-60 w-10 h-10 rounded-full border border-gray-500 shadow-2xl"
          onClick={handleAddComponentClick}
        >
          <FontAwesomeIcon icon={faPlusSquare} className="text-gray-800" />
        </button>
      )}
    </div>
  );
};

export default Meta;
