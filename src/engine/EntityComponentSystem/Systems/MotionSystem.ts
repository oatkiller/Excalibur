import { System } from '../System';
import { BuiltinComponentType, ComponentType } from '../ComponentTypes';
import { Entity } from '../Entity';
import { TransformComponent } from '../Components/TransformComponent';
import { CollisionType } from '../../Collision/CollisionType';
import { Body } from '../../Collision/Body';
import { Physics } from '../../Physics';
import { BodyComponent } from '../Components/BodyComponent';
import { MotionComponent } from '../Components/MotionComponent';
import { Actor } from '../../Actor';

export class MotionSystem extends System<TransformComponent> {
  readonly types: ComponentType[] = [BuiltinComponentType.Transform, BuiltinComponentType.Motion];

  update(entities: Entity<TransformComponent | MotionComponent | BodyComponent>[], delta: number): void {
    for (const entity of entities) {
      const transform: TransformComponent = entity.components.transform;
      const motion: MotionComponent = entity.components.motion;
      // Body component can be null, since it is not part of the system types query
      let body: Body | null = null;
      if (entity instanceof Actor) {
        body = entity.body;
      }

      transform.captureOldTransform();
      motion.captureOldMotion();

      // Update placements based on linear algebra
      const seconds = delta / 1000;

      const totalAcc = motion.acc.clone();

      // Only active vanilla actors are affected by global acceleration
      if (body && body.collider.type === CollisionType.Active) {
        totalAcc.addEqual(Physics.acc);
      }

      motion.vel.addEqual(totalAcc.scale(seconds));
      transform.pos.addEqual(motion.vel.scale(seconds)).addEqual(totalAcc.scale(0.5 * seconds * seconds));

      const inertia = body ? body.collider.inertia : 1.0;
      motion.angularVelocity += motion.torque * (1.0 / inertia) * seconds;
      transform.rotation += motion.angularVelocity * seconds;

      motion.scaleVelocity.addEqual(motion.scaleAcceleration.scale(seconds));
      transform.scale.addEqual(motion.scaleVelocity.scale(seconds)).addEqual(motion.scaleAcceleration.scale(0.5 * seconds * seconds));

      if (body && body.collider) {
        body.collider.update();
      }
    }
  }
}
