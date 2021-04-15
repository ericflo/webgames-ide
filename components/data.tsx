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
  Layer = 'layer',
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

export type ComponentLayer = {
  type: ComponentType.Layer;
  name: string;
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
  | ComponentLayer;

export type GameObject = {
  components: Component[];
};

export type Layer = {
  name: string;
  gameObjects: GameObject[];
};

export type Scene = {
  name: string;
  layers: Layer[];
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

export type SceneData = {
  scenes?: Scene[];
  assets?: Asset[];
  currentSceneName?: string;
};

export const DEFAULT_GAME_OBJECT: GameObject = {
  components: [
    { type: ComponentType.Pos, x: 0, y: 0 },
    { type: ComponentType.Rect, w: 4, h: 4 },
    { type: ComponentType.Color, r: 0, g: 0, b: 1, a: 1 },
  ],
};

export const DEFAULT_LAYERS: Layer[] = [
  {
    name: 'obj',
    gameObjects: [DEFAULT_GAME_OBJECT],
  },
  { name: 'bg', gameObjects: [] },
  { name: 'ui', gameObjects: [] },
];
export const DEFAULT_SCENES: Scene[] = [
  { name: 'main', layers: DEFAULT_LAYERS },
];
export const DEFAULT_SCENE_NAME = 'main';

export function makeDefaultSceneData(): SceneData {
  return {
    scenes: DEFAULT_SCENES,
    assets: [],
    currentSceneName: DEFAULT_SCENE_NAME,
  };
}

export default SceneData;
