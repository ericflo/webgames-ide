import React from 'react';

import { GameObject, Component } from '../data';

import MetaComponent from './metacomponent';

type Props = {
  className?: string;
  gameObject: GameObject;
  title: string;
};

const Meta = ({ className, gameObject, title }: Props) => {
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
          />
        );
      })}
    </div>
  );
};

export default Meta;
