import { BuiltinComponentType } from '../ComponentTypes';
import { Component } from '../Component';
import { Entity } from '../Entity';
import { isActor } from '../../Actor';
import { Collider, Body } from '../../Collision/Index';

// import { Body } from "../../Collision/Body";
// import { Component } from "../Component";
// import { BuiltinComponentType } from "../ComponentTypes";
// import { TransformComponent, Transform } from "./TransformComponent";
// import { Entity } from "../Entity";
// import { Vector } from "../../Algebra";
// import { MotionComponent, Motion } from "./MotionComponent";

export class BodyComponent implements Component<BuiltinComponentType.Body> {
  public readonly type = BuiltinComponentType.Body;

  public collider: Collider;
  public body: Body;

  public onAdd(entity: Entity) {
    if (isActor(entity)) {
      this.body = entity.body;
      this.collider = entity.body.collider;
    }
  }

  public clone(): BodyComponent {
    return new BodyComponent();
  }
}

// /**
//  * The body encapsulates the physical quantities and response to forces
//  */
// export class BodyComponent extends Body implements Component<BuiltinComponentType.Body>, Transform, Motion {

//   public readonly type = BuiltinComponentType.Body;
//   public dependencies = [TransformComponent, MotionComponent];
//   public owner: Entity<TransformComponent | MotionComponent> = null;
//   constructor(){
//     super({actor: null, collider: null})
//   }

//   public onAdd(owner: Entity<TransformComponent | MotionComponent>) {
//     this.owner = owner;
//   }

//   public onRemove(_previousOwner: Entity) {
//     this.owner = null;
//   }

//   public get pos(): Vector {
//     return this.owner.components.transform.pos;
//   }

//   public set pos(pos: Vector) {
//     this.owner.components.transform.pos = pos;
//   }

//   public get angularVelocity(): number {
//     return this.owner.components.motion.angularVelocity;
//   }

//   public set angularVelocity(value) {
//     this.owner.components.motion.angularVelocity = value;
//   }

//   public clone(): BodyComponent {
//     return new BodyComponent();
//   }

// }
