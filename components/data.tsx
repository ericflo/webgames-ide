export enum ComponentType {
  Pos = 'pos',
  Scale = 'scale',
  Rotate = 'rotate',
  Color = 'color',
  Sprite = 'sprite',
  Text = 'text',
  Rect = 'rect',
  Area = 'area',
  Body = 'body',
  Solid = 'solid',
  Origin = 'origin',
  Tag = 'tag',
  Action = 'action',
}

export function componentTypeName(componentType: ComponentType): string {
  switch (componentType) {
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
    case ComponentType.Tag:
      return 'Tag';
    case ComponentType.Action:
      return 'Action';
  }
}

export function defaultComponentForType(
  componentType: ComponentType
): Component {
  switch (componentType) {
    case ComponentType.Pos:
      return { type: componentType, x: 0, y: 0 };
    case ComponentType.Scale:
      return { type: componentType, x: 0, y: 0 };
    case ComponentType.Rotate:
      return { type: componentType, angle: 0 };
    case ComponentType.Color:
      return { type: componentType, r: 1, g: 1, b: 1, a: 1 };
    case ComponentType.Sprite:
      return { type: componentType, id: '' };
    case ComponentType.Text:
      return { type: componentType, text: '', size: 40, width: 0 };
    case ComponentType.Rect:
      return { type: componentType, w: 40, h: 40 };
    case ComponentType.Area:
      return {
        type: componentType,
        p1: { x: -0.25, y: -0.25 },
        p2: { x: 0.25, y: 0.25 },
      };
    case ComponentType.Body:
      return { type: componentType, jumpForce: 640, maxVel: 2400 };
    case ComponentType.Solid:
      return { type: componentType };
    case ComponentType.Origin:
      return { type: componentType, name: 'center', custom: { x: 0, y: 0 } };
    case ComponentType.Tag:
      return { type: componentType, name: 'tagname' };
    case ComponentType.Action:
      return {
        type: componentType,
        name: 'Default',
        eventName: 'update',
        code: '',
      };
  }
}

export type ComponentPos = {
  type: ComponentType.Pos;
  x: number;
  y: number;
};

export type ComponentScale = {
  type: ComponentType.Scale;
  x: number;
  y: number;
};

export type ComponentRotate = {
  type: ComponentType.Rotate;
  angle: number;
};

export type ComponentColor = {
  type: ComponentType.Color;
  r: number;
  g: number;
  b: number;
  a: number;
};

export type ComponentSprite = {
  type: ComponentType.Sprite;
  id: string;
};

export type ComponentText = {
  type: ComponentType.Text;
  text: string;
  size: number;
  width: number;
  //font: string;
};

export type ComponentRect = {
  type: ComponentType.Rect;
  w: number;
  h: number;
};

export type ComponentArea = {
  type: ComponentType.Area;
  p1: { x: number; y: number };
  p2: { x: number; y: number };
};

export type ComponentBody = {
  type: ComponentType.Body;
  jumpForce: number;
  maxVel: number;
};

export type ComponentSolid = {
  type: ComponentType.Solid;
};

export type ComponentOrigin = {
  type: ComponentType.Origin;
  name: string;
  custom: { x: number; y: number };
};

export type ComponentTag = {
  type: ComponentType.Tag;
  name: string;
};

export type ComponentAction = {
  type: ComponentType.Action;
  name: string;
  eventName: string;
  code: string;
};

export type Component =
  | ComponentPos
  | ComponentScale
  | ComponentRotate
  | ComponentColor
  | ComponentSprite
  | ComponentText
  | ComponentRect
  | ComponentArea
  | ComponentBody
  | ComponentSolid
  | ComponentOrigin
  | ComponentTag
  | ComponentAction;

export type GameObject = {
  name: string;
  components: Component[];
};

export type Layer = {
  name: string;
  gameObjects: GameObject[];
};

export type Scene = {
  name: string;
  layers: Layer[];
  actions: Action[];
};

export enum AssetType {
  Sprite = 'sprite',
  Sound = 'sound',
  Font = 'font',
}

export type Asset = {
  name: string;
  type: AssetType;
  skylink: string;
};

export enum ActionType {
  Action = 'action',
  Render = 'render',
  Collides = 'collides',
  Overlaps = 'overlaps',
  On = 'on',
  KeyDown = 'keyDown',
  KeyPress = 'keyPress',
  KeyRelease = 'keyRelease',
  CharInput = 'charInput',
  MouseDown = 'mouseDown',
  MouseClick = 'mouseClick',
  MouseRelease = 'mouseRelease',
}

export type Action = {
  type: ActionType;
  tag?: string;
  otherTag?: string;
  eventName?: string;
  keyName?: string;
  code: string;
};

export type SceneData = {
  scenes?: Scene[];
  assets?: Asset[];
  currentSceneName?: string;
};

export type GameScore = {
  score: number;
  skylink: string;
  ts: number;
};

export const DEFAULT_GAME_OBJECT: GameObject = {
  name: 'Default Game Object',
  components: [
    { type: ComponentType.Pos, x: 60, y: 60 },
    { type: ComponentType.Rect, w: 40, h: 40 },
    { type: ComponentType.Color, r: 0, g: 0, b: 1, a: 1 },
  ],
};

export const DEFAULT_ACTION: Action = {
  type: ActionType.Action,
  code: '',
};

export const DEFAULT_LAYERS: Layer[] = [
  { name: 'obj', gameObjects: [] },
  { name: 'bg', gameObjects: [] },
  { name: 'ui', gameObjects: [] },
];
export const DEFAULT_SCENES: Scene[] = [
  { name: 'main', layers: DEFAULT_LAYERS, actions: [] },
];
export const DEFAULT_SCENE_NAME = 'main';

export function makeDefaultSceneData(): SceneData {
  return JSON.parse(
    JSON.stringify({
      scenes: DEFAULT_SCENES,
      assets: [],
      currentSceneName: DEFAULT_SCENE_NAME,
    })
  );
}

export function makeEmptySceneData(): SceneData {
  const sd = makeDefaultSceneData();
  sd.scenes.forEach((scene: Scene) => {
    scene.layers.forEach((layer: Layer) => {
      layer.gameObjects.length = 0;
    });
  });
  return sd;
}

export default SceneData;
