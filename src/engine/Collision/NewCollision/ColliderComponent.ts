import { CollisionShape } from '../CollisionShape';
import { CollisionType } from '../CollisionType';
import { CollisionGroup } from '../CollisionGroup';
import { Vector } from '../../Algebra';
import { TransformComponent } from './TransformComponent';

export class Contact {
  /**
   * The id of this collision contact
   */
  id: string;
  /**
   * The first collider in the collision
   */
  colliderA: ColliderComponent;
  /**
   * The second collider in the collision
   */
  colliderB: ColliderComponent;
  /**
   * The minimum translation vector to resolve penetration, pointing away from colliderA
   */
  mtv: Vector;
  /**
   * The point of collision shared between colliderA and colliderB
   */
  point: Vector;
  /**
   * The collision normal, pointing away from colliderA
   */
  normal: Vector;
}

export class ColliderComponent {
  private static _ID = 0;
  id: number = ColliderComponent._ID++;
  transform: TransformComponent;
  type: CollisionType = CollisionType.PreventCollision;
  shape: CollisionShape;
  group = CollisionGroup.All;

  collide(other: ColliderComponent): Contact[] {
    return [new Contact()];
  }

  contains(point: Vector): boolean {
    return false;
  }

  isTouching(other: ColliderComponent): boolean {
    return false;
  }
}
