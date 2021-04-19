import React, { useCallback } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

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
  ComponentTag,
  componentTypeName,
} from '../data';

type Props = {
  gameObject: GameObject;
  component: Component;
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
    <>
      <label>X:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.x}
        onChange={handleXChange}
      />
      <label>Y:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.y}
        onChange={handleYChange}
      />
    </>
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
    <>
      <label>X:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.x}
        onChange={handleXChange}
      />
      <label>Y:</label>
      <input
        className="w-16 text-center"
        type="text"
        defaultValue={'' + component.y}
        onChange={handleYChange}
      />
    </>
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
    <>
      <label>Angle:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.angle}
        onChange={handleAngleChange}
      />
    </>
  );
};

const FormColor = ({
  component,
  onChange,
}: {
  component: ComponentColor;
  onChange: (component: Component) => void;
}) => {
  const handleRChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.r = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleGChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.g = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleBChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.b = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  const handleAChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.a = zeroFromNaN(parseFloat(ev.target.value));
      onChange(component);
    },
    [component]
  );
  return (
    <>
      <div>
        <div className="flex w-full place-items-center mb-1">
          <label>R:</label>
          <input
            className="w-10 text-center mx-1"
            type="text"
            defaultValue={'' + component.r}
            onChange={handleRChange}
          />
          <label>G:</label>
          <input
            className="w-10 text-center mx-1"
            type="text"
            defaultValue={'' + component.g}
            onChange={handleGChange}
          />
          <label>B:</label>
          <input
            className="w-10 text-center mx-1"
            type="text"
            defaultValue={'' + component.b}
            onChange={handleBChange}
          />
        </div>
        <div className="flex w-full place-items-center">
          <label>A:</label>
          <input
            className="w-10 text-center ml-1"
            type="text"
            defaultValue={'' + component.a}
            onChange={handleAChange}
          />
        </div>
      </div>
    </>
  );
};

const FormSprite = ({
  component,
  onChange,
}: {
  component: ComponentSprite;
  onChange: (component: Component) => void;
}) => {
  const handleIDChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      component.id = ev.target.value;
      onChange(component);
    },
    [component]
  );
  return (
    <>
      <label>ID:</label>
      <input
        type="text"
        defaultValue={'' + component.id}
        onChange={handleIDChange}
      />
    </>
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
    <>
      <label>Text:</label>
      <input
        type="text"
        defaultValue={'' + component.text}
        onChange={handleTextChange}
      />
      <label>Size:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.size}
        onChange={handleSizeChange}
      />
      <label>Width:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.width}
        onChange={handleWidthChange}
      />
    </>
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
    <>
      <label>W:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.w}
        onChange={handleWChange}
      />
      <label>H:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.h}
        onChange={handleHChange}
      />
    </>
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
    <>
      <label>P1 X:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.p1.x}
        onChange={handleP1XChange}
      />
      <label>P1 Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.p1.y}
        onChange={handleP1YChange}
      />
      <label>P2 X:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.p2.x}
        onChange={handleP2XChange}
      />
      <label>P2 Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.p2.y}
        onChange={handleP2YChange}
      />
    </>
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
    <>
      <label>Jump Force:</label>
      <input
        type="text"
        defaultValue={'' + component.jumpForce}
        onChange={handleJumpForceChange}
      />
      <label>Max Vel:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.maxVel}
        onChange={handleMaxVelChange}
      />
    </>
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
    (ev: React.ChangeEvent<HTMLInputElement>) => {
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
    <>
      <label>Name:</label>
      <input
        type="text"
        defaultValue={'' + component.name}
        onChange={handleNameChange}
      />
      <label>Custom X:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.custom.x}
        onChange={handleCustomXChange}
      />
      <label>Custom Y:</label>
      <input
        className="w-12 text-center"
        type="text"
        defaultValue={'' + component.custom.y}
        onChange={handleCustomYChange}
      />
    </>
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
    <>
      <label>Name:</label>
      <input
        type="text"
        defaultValue={'' + component.name}
        onChange={handleNameChange}
      />
    </>
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
    <>
      <label>Name:</label>
      <input
        type="text"
        defaultValue={'' + component.name}
        onChange={handleNameChange}
      />
    </>
  );
};

function ComponentForm({
  component,
  onChange,
}: {
  component: Component;
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
      {componentTypeName(component.type)}
      <form
        className="flex place-items-center justify-around"
        onSubmit={handleSubmit}
      >
        <ComponentForm
          component={component}
          onChange={onChange}
          key="component-form"
        />
      </form>
    </div>
  );
};

export default MetaComponent;
