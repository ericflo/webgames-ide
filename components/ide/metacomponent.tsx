import React from 'react';

import { GameObject, Component } from '../data';

type Props = {
  gameObject: GameObject;
  component: Component;
};

const MetaComponent = ({ gameObject, component }: Props) => {
  return <div className="mx-4 my-2">{component.type}</div>;
};

export default MetaComponent;
