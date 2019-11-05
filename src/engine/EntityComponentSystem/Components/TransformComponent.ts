import { Component } from '../Component';
import { BuiltinComponentType } from '../ComponentTypes';
import { Vector } from '../../Algebra';
import { Entity } from '../Entity';

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

export interface Transform {
  /**
   * Position in the 2D coordinate plane, (0, 0) beiong the default, in pixels
   */
  pos: Vector;

  /**
   * The z-index of this transform, influences the order of draw
   */
  z: number;

  /**
   * The rotation (in radians) of this transform
   */
  rotation: number;

  /**
   * The scale of this transform, (1, 1) being the default original scale
   */
  scale: Vector;

  // /**
  //  * The velocity of this transform, (0, 0) being the default, in pixels/second
  //  */
  // vel: Vector;

  // /**
  //  * The angular velocity, or change in rotation over time, in radians/second
  //  */
  // angularVelocity: number;

  // /**
  //  * The amount of scale increase over time, in scale/second
  //  */
  // scaleVelocity: Vector;

  // /**
  //  * The acceleration of this tranform, (0, 0) being the default, in pixels/second^2
  //  */
  // acc: Vector;
  // /**
  //  * The angular force applied to the transform in terms of torque, mass * pixels^2 * second^-2. If there is a [[BodyComponent]] attached
  //  * to the entity, the [[BodyComponent]] inertia will be used in the calculation otherwise inertia is assumed to be 1 mass * pixels^2
  //  */
  // torque: number;

  // /**
  //  * The amount of scale acceleration over time, in scale/second^2
  //  */
  // scaleAcceleration: Vector;
}

export class TransformComponent implements Component<BuiltinComponentType.Transform>, Transform {
  public readonly type = BuiltinComponentType.Transform;
  public owner: Entity = null;

  /**
   * The [[coordinate plane|CoordPlane]] for this transform
   */
  public coordPlane = CoordPlane.World;

  // Pos
  public pos: Vector = Vector.Zero;
  public z: number = 0;
  public rotation: number = 0;
  public scale: Vector = Vector.One;

  // // Vel
  // public vel: Vector = Vector.Zero;
  // public angularVelocity: number = 0;
  // public scaleVelocity: Vector = Vector.Zero;

  // // Acc
  // public acc: Vector = Vector.Zero;
  // public torque: number = 0;
  // public scaleAcceleration: Vector = Vector.Zero;

  /**
   * The old transform captured from the previous frame
   */
  public old: Transform = {
    pos: Vector.Zero,
    // vel: Vector.Zero,
    // acc: Vector.Zero,

    rotation: 0,
    // angularVelocity: 0,
    // torque: 0,

    z: -1, // z needs to be different at first for draw tree ordering
    scale: Vector.One
    // scaleVelocity: Vector.Zero,
    // scaleAcceleration: Vector.Zero
  };

  /**
   * Captures the values of the current transform into the old
   * @internal
   */
  public captureOldTransform() {
    // Capture old values before integration step updates them
    this.old.pos.setTo(this.pos.x, this.pos.y);
    // this.old.vel.setTo(this.vel.x, this.vel.y);
    // this.old.acc.setTo(this.acc.x, this.acc.y);

    this.old.rotation = this.rotation;
    // this.old.angularVelocity = this.angularVelocity;
    // this.old.torque = this.torque;

    this.old.z = this.z;

    this.old.scale.setTo(this.scale.x, this.scale.y);
    // this.old.scaleVelocity.setTo(this.scaleVelocity.x, this.scaleVelocity.y);
    // this.old.scaleAcceleration.setTo(this.scaleAcceleration.x, this.scaleAcceleration.y);
  }

  public get changed(): boolean {
    return (
      !this.pos.equals(this.old.pos) ||
      this.rotation !== this.old.rotation ||
      // !this.vel.equals(this.old.vel) ||
      // this.angularVelocity !== this.old.angularVelocity ||
      // !this.acc.equals(this.old.acc) ||
      // this.torque !== this.old.torque ||
      this.z !== this.old.z ||
      !this.scale.equals(this.old.scale) // ||
      // !this.scaleVelocity.equals(this.old.scaleVelocity) ||
      // !this.scaleAcceleration.equals(this.old.scaleAcceleration)
    );
  }

  public clone(): TransformComponent {
    // TODO utility for cloning, maybe a .props that has cloning utilities

    const clonedTransform = new TransformComponent();
    clonedTransform.coordPlane = this.coordPlane;

    clonedTransform.pos = this.pos.clone();
    // clonedTransform.vel = this.vel.clone();
    // clonedTransform.acc = this.acc.clone();

    clonedTransform.z = this.z;
    // clonedTransform.oldZ = this.oldZ;

    clonedTransform.rotation = this.rotation;
    // clonedTransform.angularVelocity = this.angularVelocity;
    // clonedTransform.torque = this.torque;

    clonedTransform.scale = this.scale.clone();
    // clonedTransform.scaleVelocity = this.scaleVelocity.clone();
    // clonedTransform.scaleAcceleration = this.scaleAcceleration.clone();

    return clonedTransform;
  }
}
