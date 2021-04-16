import React, { useCallback } from 'react';

import { GameObject, Component } from '../data';

import MetaComponent from './metacomponent';

type Props = {
  className?: string;
  gameObject: GameObject;
  title: string;
  onChangeComponent: (i: number, component: Component) => void;
};

const Meta = ({ className, gameObject, title, onChangeComponent }: Props) => {
  return (
    <div className={className}>
      <h3 className="mx-4 my-2 font-light text-black text-opacity-70">
        Meta
        <span className="float-right">{title}</span>
      </h3>
      {gameObject.components.map((component: Component, i: number) => {
        return (
          <MetaComponent
            key={i}
            gameObject={gameObject}
            component={component}
            onChange={onChangeComponent.bind(null, i)}
          />
        );
      })}
    </div>
  );
};

export default Meta;
