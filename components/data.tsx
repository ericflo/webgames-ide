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

export type Component = {
  type: ComponentType;
};

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

export type SceneData = {
  scenes?: Scene[];
  currentSceneName?: string;
};

export const DEFAULT_LAYERS: Layer[] = [
  {
    name: 'obj',
    gameObjects: [
      {
        components: [
          { type: ComponentType.Pos },
          { type: ComponentType.Rect },
          { type: ComponentType.Color },
        ],
      },
    ],
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
    currentSceneName: DEFAULT_SCENE_NAME,
  };
}

export default SceneData;