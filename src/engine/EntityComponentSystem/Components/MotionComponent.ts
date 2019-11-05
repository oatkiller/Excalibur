import { BuiltinComponentType } from '../ComponentTypes';
import { Component } from '../Component';
import { Vector } from '../../Algebra';

export interface Motion {
  /**
   * The velocity of this transform, (0, 0) being the default, in pixels/second
   */
  vel: Vector;

  /**
   * The angular velocity, or change in rotation over time, in radians/second
   */
  angularVelocity: number;

  /**
   * The amount of scale increase over time, in scale/second
   */
  scaleVelocity: Vector;

  /**
   * The acceleration of this tranform, (0, 0) being the default, in pixels/second^2
   */
  acc: Vector;
  /**
   * The angular force applied to the transform in terms of torque, mass * pixels^2 * second^-2. If there is a [[BodyComponent]] attached
   * to the entity, the [[BodyComponent]] inertia will be used in the calculation otherwise inertia is assumed to be 1 mass * pixels^2
   */
  torque: number;

  /**
   * The amount of scale acceleration over time, in scale/second^2
   */
  scaleAcceleration: Vector;
}

export class MotionComponent implements Component<BuiltinComponentType.Motion>, Motion {
  public readonly type = BuiltinComponentType.Motion;

  // Vel
  public vel: Vector = Vector.Zero;
  public angularVelocity: number = 0;
  public scaleVelocity: Vector = Vector.Zero;

  // Acc
  public acc: Vector = Vector.Zero;
  public torque: number = 0;
  public scaleAcceleration: Vector = Vector.Zero;

  /**
   * The old transform captured from the previous frame
   */
  public old: Motion = {
    vel: Vector.Zero,
    acc: Vector.Zero,

    angularVelocity: 0,
    torque: 0,

    scaleVelocity: Vector.Zero,
    scaleAcceleration: Vector.Zero
  };

  public captureOldMotion() {
    // Capture old values before integration step updates them
    this.old.vel.setTo(this.vel.x, this.vel.y);
    this.old.acc.setTo(this.acc.x, this.acc.y);
    this.old.angularVelocity = this.angularVelocity;
    this.old.torque = this.torque;
    this.old.scaleVelocity.setTo(this.scaleVelocity.x, this.scaleVelocity.y);
    this.old.scaleAcceleration.setTo(this.scaleAcceleration.x, this.scaleAcceleration.y);
  }

  public clone() {
    return new MotionComponent();
  }
}
