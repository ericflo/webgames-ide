import React, { useCallback, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { ChromePicker, Color } from 'react-color';

import {
  Asset,
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
  ComponentTag,
  componentTypeName,
} from '../data';

type Props = {
  gameObject: GameObject;
  component: Component;
  assets: Asset[];
  onChange: (component: Component) => void;
  onDelete: () => void;
};

function zeroFromNaN(i: number) {
  if (isNaN(i)) {
    return 0;
  }
  return i;
}

const FormPos = ({
  component,
  onChange,
}: {
  component: ComponentPos;
  onChange: (component: Component) => void;
}) => {
  const handleXChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.x = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleYChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.y = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full flex place-items-center justify-between">
      <label className="pointer-events-none select-none">X:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.x}
        onChange={handleXChange}
      />
      <label className="pointer-events-none select-none">Y:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.y}
        onChange={handleYChange}
      />
    </div>
  );
};

const FormScale = ({
  component,
  onChange,
}: {
  component: ComponentScale;
  onChange: (component: Component) => void;
}) => {
  const handleXChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.x = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleYChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.y = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full flex place-items-center justify-between">
      <label className="pointer-events-none select-none">X:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.x}
        onChange={handleXChange}
      />
      <label className="pointer-events-none select-none">Y:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.y}
        onChange={handleYChange}
      />
    </div>
  );
};

const FormRotate = ({
  component,
  onChange,
}: {
  component: ComponentRotate;
  onChange: (component: Component) => void;
}) => {
  const handleAngleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.angle = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full flex place-items-center justify-between">
      <label className="pointer-events-none select-none">Angle:</label>
      <input
        className="w-24 text-center"
        type="text"
        defaultValue={'' + component.angle}
        onChange={handleAngleChange}
      />
    </div>
  );
};

const FormColor = ({
  component,
  onChange,
}: {
  component: ComponentColor;
  onChange: (component: Component) => void;
}) => {
  const [color, setColor] = useState({
    r: component.r * 255.0,
    g: component.g * 255.0,
    b: component.b * 255.0,
    a: component.a,
  });
  const handleChangeComplete = useCallback(
    (col: Color) => {
      setColor(col.rgb);
      component.r = col.rgb.r / 255.0;
      component.g = col.rgb.g / 255.0;
      component.b = col.rgb.b / 255.0;
      component.a = col.rgb.a;
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2">
      <div className="flex w-full place-items-center mb-1">
        <ChromePicker color={color} onChange={handleChangeComplete} />
      </div>
    </div>
  );
};

const FormSprite = ({
  component,
  assets,
  onChange,
}: {
  component: ComponentSprite;
  assets: Asset[];
  onChange: (component: Component) => void;
}) => {
  const handleIDChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      component.id = ev.target.value;
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full flex place-items-center justify-between">
      <label className="mr-8 pointer-events-none select-none">ID:</label>
      <select
        className="w-64"
        defaultValue={'' + component.id}
        onChange={handleIDChange}
      >
        <option value="">None</option>
        {assets.map((asset: Asset) => {
          return (
            <option key={asset.skylink} value={asset.name}>
              {asset.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const FormText = ({
  component,
  onChange,
}: {
  component: ComponentText;
  onChange: (component: Component) => void;
}) => {
  const handleTextChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.text = ev.target.value;
      onChange(component);
    },
    [component]
  );
  const handleSizeChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.size = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleWidthChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.width = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div>
      <div className="mb-2 mt-2">
        <label className="mr-2 pointer-events-none select-none">Text:</label>
        <input
          type="text"
          defaultValue={'' + component.text}
          onChange={handleTextChange}
        />
      </div>
      <div className="flex place-items-center justify-between">
        <label className="pointer-events-none select-none">Size:</label>
        <input
          className="w-16 text-center mr-1"
          type="text"
          defaultValue={'' + component.size}
          onChange={handleSizeChange}
        />
        <label className="pointer-events-none select-none">Width:</label>
        <input
          className="w-16 text-center"
          type="text"
          defaultValue={'' + component.width}
          onChange={handleWidthChange}
        />
      </div>
    </div>
  );
};

const FormRect = ({
  component,
  onChange,
}: {
  component: ComponentRect;
  onChange: (component: Component) => void;
}) => {
  const handleWChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.w = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleHChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.h = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="w-full mt-2 mx-2 flex place-items-center justify-between">
      <label className="pointer-events-none select-none">W:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.w}
        onChange={handleWChange}
      />
      <label className="pointer-events-none select-none">H:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.h}
        onChange={handleHChange}
      />
    </div>
  );
};

const FormArea = ({
  component,
  onChange,
}: {
  component: ComponentArea;
  onChange: (component: Component) => void;
}) => {
  const handleP1XChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p1.x = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleP1YChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p1.y = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleP2XChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p2.x = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleP2YChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.p2.y = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full">
      <div className="flex place-items-center justify-between mb-2">
        <label className="pointer-events-none select-none">P1 X:</label>
        <input
          className="w-12 text-center"
          type="text"
          defaultValue={'' + component.p1.x}
          onChange={handleP1XChange}
        />
        <label className="pointer-events-none select-none">P1 Y:</label>
        <input
          className="w-12 text-center"
          type="text"
          defaultValue={'' + component.p1.y}
          onChange={handleP1YChange}
        />
      </div>
      <div className="flex place-items-center justify-between">
        <label className="pointer-events-none select-none">P2 X:</label>
        <input
          className="w-12 text-center"
          type="text"
          defaultValue={'' + component.p2.x}
          onChange={handleP2XChange}
        />
        <label className="pointer-events-none select-none">P2 Y:</label>
        <input
          className="w-12 text-center"
          type="text"
          defaultValue={'' + component.p2.y}
          onChange={handleP2YChange}
        />
      </div>
    </div>
  );
};

const FormBody = ({
  component,
  onChange,
}: {
  component: ComponentBody;
  onChange: (component: Component) => void;
}) => {
  const handleJumpForceChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.jumpForce = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleMaxVelChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.maxVel = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="flex flex-col w-full mx-4 my-2">
      <div className="flex place-items-center justify-between mb-2">
        <label className="pointer-events-none select-none">Jump Force:</label>
        <input
          className="w-14 text-center"
          type="text"
          defaultValue={'' + component.jumpForce}
          onChange={handleJumpForceChange}
        />
      </div>
      <div className="flex place-items-center justify-between">
        <label className="pointer-events-none select-none">Max Vel:</label>
        <input
          className="w-14 text-center"
          type="text"
          defaultValue={'' + component.maxVel}
          onChange={handleMaxVelChange}
        />
      </div>
    </div>
  );
};

const FormSolid = ({
  component,
  onChange,
}: {
  component: ComponentSolid;
  onChange: (component: Component) => void;
}) => {
  return null;
};

const FormOrigin = ({
  component,
  onChange,
}: {
  component: ComponentOrigin;
  onChange: (component: Component) => void;
}) => {
  const handleNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      component.name = ev.target.value;
      onChange(component);
    },
    [component]
  );
  const handleCustomXChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.custom.x = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleCustomYChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.custom.y = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mx-2 my-2 w-full">
      <div className="w-full flex place-items-center justify-between mb-2">
        <label className="pointer-events-none select-none">Name:</label>
        <select
          className="w-44"
          defaultValue={'' + component.name}
          onChange={handleNameChange}
        >
          <option value="topleft">topleft</option>
          <option value="top">top</option>
          <option value="topright">topright</option>
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
          <option value="botleft">botleft</option>
          <option value="bot">bot</option>
          <option value="botright">botright</option>
        </select>
      </div>
      <div className="w-full flex place-items-center justify-between">
        <label className="pointer-events-none select-none">Custom X:</label>
        <input
          className="w-12 text-center"
          type="text"
          defaultValue={'' + component.custom.x}
          onChange={handleCustomXChange}
        />
        <label className="pointer-events-none select-none">Y:</label>
        <input
          className="w-12 text-center"
          type="text"
          defaultValue={'' + component.custom.y}
          onChange={handleCustomYChange}
        />
      </div>
    </div>
  );
};

const FormLayer = ({
  component,
  onChange,
}: {
  component: ComponentLayer;
  onChange: (component: Component) => void;
}) => {
  const handleNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.name = ev.target.value;
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full flex place-items-center justify-between">
      <label className="mr-2 pointer-events-none select-none">Name:</label>
      <input
        type="text"
        defaultValue={'' + component.name}
        onChange={handleNameChange}
      />
    </div>
  );
};

const FormTag = ({
  component,
  onChange,
}: {
  component: ComponentTag;
  onChange: (component: Component) => void;
}) => {
  const handleNameChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.name = ev.target.value;
      onChange(component);
    },
    [component]
  );
  return (
    <div className="mt-2 mx-2 w-full flex place-items-center justify-between">
      <label className="mr-2 pointer-events-none select-none">Name:</label>
      <input
        type="text"
        defaultValue={'' + component.name}
        onChange={handleNameChange}
      />
    </div>
  );
};

function ComponentForm({
  component,
  assets,
  onChange,
}: {
  component: Component;
  assets: Asset[];
  onChange: (component: Component) => void;
}) {
  switch (component.type) {
    case ComponentType.Pos:
      return (
        <FormPos key="comp-pos" component={component} onChange={onChange} />
      );
    case ComponentType.Scale:
      return (
        <FormScale key="comp-scale" component={component} onChange={onChange} />
      );
    case ComponentType.Rotate:
      return (
        <FormRotate
          key="comp-rotate"
          component={component}
          onChange={onChange}
        />
      );
    case ComponentType.Color:
      return (
        <FormColor key="comp-color" component={component} onChange={onChange} />
      );
    case ComponentType.Sprite:
      return (
        <FormSprite
          key="comp-sprite"
          component={component}
          assets={assets}
          onChange={onChange}
        />
      );
    case ComponentType.Text:
      return (
        <FormText key="comp-text" component={component} onChange={onChange} />
      );
    case ComponentType.Rect:
      return (
        <FormRect key="comp-rect" component={component} onChange={onChange} />
      );
    case ComponentType.Area:
      return (
        <FormArea key="comp-area" component={component} onChange={onChange} />
      );
    case ComponentType.Body:
      return (
        <FormBody key="comp-body" component={component} onChange={onChange} />
      );
    case ComponentType.Solid:
      return (
        <FormSolid key="comp-solid" component={component} onChange={onChange} />
      );
    case ComponentType.Origin:
      return (
        <FormOrigin
          key="comp-origin"
          component={component}
          onChange={onChange}
        />
      );
    case ComponentType.Layer:
      return (
        <FormLayer key="comp-layer" component={component} onChange={onChange} />
      );
    case ComponentType.Tag:
      return (
        <FormTag key="comp-tag" component={component} onChange={onChange} />
      );
  }
  return null;
}

const MetaComponent = ({
  gameObject,
  component,
  assets,
  onChange,
  onDelete,
}: Props) => {
  const handleSubmit = useCallback((ev: React.FormEvent) => {
    ev.preventDefault();
  }, []);

  const handleDeleteClick = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      if (
        confirm(
          'Are you sure you want to delete the ' +
            component.type +
            ' component?'
        )
      ) {
        onDelete();
      }
    },
    [component]
  );

  return (
    <div className="mx-4 my-2 px-4 py-2 rounded-lg bg-gray-200">
      <span className="float-right cursor-pointer" onClick={handleDeleteClick}>
        <FontAwesomeIcon icon={faTrash} />
      </span>
      <span className="pointer-events-none select-none">
        {componentTypeName(component.type)}
      </span>
      <form
        className="flex place-items-center justify-around"
        onSubmit={handleSubmit}
      >
        <ComponentForm
          component={component}
          assets={assets}
          onChange={onChange}
          key="component-form"
        />
      </form>
    </div>
  );
};

export default MetaComponent;
