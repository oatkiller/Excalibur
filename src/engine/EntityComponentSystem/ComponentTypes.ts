export type ComponentType = string | BuiltinComponentType;

// Enum contianing the builtin component types
export enum BuiltinComponentType {
  Transform = 'transform',
  Motion = 'motion',
  Drawing = 'drawing',
  DrawCollider = 'drawcollider',
  Action = 'action',
  Offscreen = 'offscreen',
  Body = 'body',
  Collider = 'collider',
  Lifetime = 'lifetime',
  Debug = 'debug'
}
