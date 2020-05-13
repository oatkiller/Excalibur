import { Vector } from '../../Algebra';

/**
 * Enum representing the coordinate plane for the position 2D vector in the [[TransformComponent]]
 */
export enum CoordPlane {
  /**
   * The world coordinate plane (default) represents world space, any entities drawn with world space move when the camera moves.
   */
  World = 'world',
  /**
   * The screen coordinate plane represents screen space, entities drawn in screen space are pinned to screen coordinates ignoring the camera.
   */
  Screen = 'screen'
}

export class TransformComponent {
  public coordPlane = CoordPlane.World;

  public pos: Vector = Vector.Zero;
  public z: number = 0;
  public vel: Vector = Vector.Zero;
  public acc: Vector = Vector.Zero;

  public rotation: number = 0;
  public angularVelocity: number = 0;
  public angularAcceleration: number = 0;

  public scale: Vector = Vector.One;
}
