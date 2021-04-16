import React, { useCallback } from 'react';

import {
  GameObject,
  Component,
  ComponentType,
  ComponentPos,
  ComponentScale,
  ComponentRotate,
  ComponentColor,
  ComponentSprite,
  ComponentText,
  ComponentRect,
  ComponentArea,
  ComponentBody,
  ComponentSolid,
  ComponentOrigin,
  ComponentLayer,
} from '../data';

type Props = {
  gameObject: GameObject;
  component: Component;
  onChange: (component: Component) => void;
};

function componentTypeName(component: Component): string {
  switch (component.type) {
    case ComponentType.Pos:
      return 'Position';
    case ComponentType.Scale:
      return 'Scale';
    case ComponentType.Rotate:
      return 'Rotate';
    case ComponentType.Color:
      return 'Color';
    case ComponentType.Sprite:
      return 'Sprite';
    case ComponentType.Text:
      return 'Text';
    case ComponentType.Rect:
      return 'Rect';
    case ComponentType.Area:
      return 'Area';
    case ComponentType.Body:
      return 'Body';
    case ComponentType.Solid:
      return 'Solid';
    case ComponentType.Origin:
      return 'Origin';
    case ComponentType.Layer:
      return 'Layer';
  }
}

function zeroFromNaN(i: number) {
  if (isNaN(i)) {
    return 0;
  }
  return i;
}

const FormPos = (component: ComponentPos): JSX.Element => {
  const handleXChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.x = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleYChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.y = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>X:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.x}
        onChange={handleXChange}
      />
      <label>Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.y}
        onChange={handleYChange}
      />
    </>
  );
};

const FormScale = (component: ComponentScale): JSX.Element => {
  const handleXChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.x = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleYChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.y = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>X:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.x}
        onChange={handleXChange}
      />
      <label>Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.y}
        onChange={handleYChange}
      />
    </>
  );
};

const FormRotate = (component: ComponentRotate): JSX.Element => {
  const handleAngleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.angle = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>Angle:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.angle}
        onChange={handleAngleChange}
      />
    </>
  );
};

const FormColor = (component: ComponentColor): JSX.Element => {
  const handleRChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.r = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleGChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.g = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleBChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.b = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleAChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.a = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>R:</label>
      <input
        className="w-12 text-center mx-1"
        type="text"
        value={'' + component.r}
        onChange={handleRChange}
      />
      <label>G:</label>
      <input
        className="w-12 text-center mx-1"
        type="text"
        value={'' + component.g}
        onChange={handleGChange}
      />
      <label>B:</label>
      <input
        className="w-12 text-center mx-1"
        type="text"
        value={'' + component.b}
        onChange={handleBChange}
      />
      <label>A:</label>
      <input
        className="w-12 text-center ml-1"
        type="text"
        value={'' + component.a}
        onChange={handleAChange}
      />
    </>
  );
};

const FormSprite = (component: ComponentSprite): JSX.Element => {
  const handleIDChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.id = ev.target.value;
    },
    [component]
  );
  return (
    <>
      <label>ID:</label>
      <input type="text" value={'' + component.id} onChange={handleIDChange} />
    </>
  );
};

const FormText = (component: ComponentText): JSX.Element => {
  const handleTextChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.text = ev.target.value;
    },
    [component]
  );
  const handleSizeChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.size = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleWidthChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.width = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>Text:</label>
      <input
        type="text"
        value={'' + component.text}
        onChange={handleTextChange}
      />
      <label>Size:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.size}
        onChange={handleSizeChange}
      />
      <label>Width:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.width}
        onChange={handleWidthChange}
      />
    </>
  );
};

const FormRect = (component: ComponentRect): JSX.Element => {
  const handleWChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.w = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleHChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.h = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>W:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.w}
        onChange={handleWChange}
      />
      <label>H:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.h}
        onChange={handleHChange}
      />
    </>
  );
};

const FormArea = (component: ComponentArea): JSX.Element => {
  const handleP1XChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p1.x = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleP1YChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p1.y = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleP2XChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p2.x = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleP2YChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p2.y = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>P1 X:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.p1.x}
        onChange={handleP1XChange}
      />
      <label>P1 Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.p1.y}
        onChange={handleP1YChange}
      />
      <label>P2 X:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.p2.x}
        onChange={handleP2XChange}
      />
      <label>P2 Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.p2.y}
        onChange={handleP2YChange}
      />
    </>
  );
};

const FormBody = (component: ComponentBody): JSX.Element => {
  const handleJumpForceChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.jumpForce = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleMaxVelChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.maxVel = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>Jump Force:</label>
      <input
        type="text"
        value={'' + component.jumpForce}
        onChange={handleJumpForceChange}
      />
      <label>Max Vel:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.maxVel}
        onChange={handleMaxVelChange}
      />
    </>
  );
};

const FormSolid = (component: ComponentSolid): JSX.Element => {
  return null;
};

const FormOrigin = (component: ComponentOrigin): JSX.Element => {
  const handleNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.name = ev.target.value;
    },
    [component]
  );
  const handleCustomXChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.custom.x = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  const handleCustomYChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.custom.y = zeroFromNaN(parseFloat(ev.target.value));
    },
    [component]
  );
  return (
    <>
      <label>Name:</label>
      <input
        type="text"
        value={'' + component.name}
        onChange={handleNameChange}
      />
      <label>Custom X:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.custom.x}
        onChange={handleCustomXChange}
      />
      <label>Custom Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        value={'' + component.custom.y}
        onChange={handleCustomYChange}
      />
    </>
  );
};

const FormLayer = (component: ComponentLayer): JSX.Element => {
  const handleNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.name = ev.target.value;
    },
    [component]
  );
  return (
    <>
      <label>Name:</label>
      <input
        type="text"
        value={'' + component.name}
        onChange={handleNameChange}
      />
    </>
  );
};

function componentForm(component: Component): JSX.Element {
  switch (component.type) {
    case ComponentType.Pos:
      return FormPos(component);
    case ComponentType.Scale:
      return FormScale(component);
    case ComponentType.Rotate:
      return FormRotate(component);
    case ComponentType.Color:
      return FormColor(component);
    case ComponentType.Sprite:
      return FormSprite(component);
    case ComponentType.Text:
      return FormText(component);
    case ComponentType.Rect:
      return FormRect(component);
    case ComponentType.Area:
      return FormArea(component);
    case ComponentType.Body:
      return FormBody(component);
    case ComponentType.Solid:
      return FormSolid(component);
    case ComponentType.Origin:
      return FormOrigin(component);
    case ComponentType.Layer:
      return FormLayer(component);
  }
}

const MetaComponent = ({ gameObject, component, onChange }: Props) => {
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLFormElement>) => {
      if (!ev.defaultPrevented) {
        onChange(component);
      }
    },
    [component]
  );
  const handleSubmit = useCallback((ev: React.FormEvent) => {
    ev.preventDefault();
  }, []);
  return (
    <div className="mx-4 my-2 px-4 py-2 rounded-lg bg-gray-200">
      {componentTypeName(component)}
      <form
        className="flex place-items-center justify-around flex-nowrap"
        onChange={handleChange}
        onSubmit={handleSubmit}
      >
        {componentForm(component)}
      </form>
    </div>
  );
};

export default MetaComponent;
