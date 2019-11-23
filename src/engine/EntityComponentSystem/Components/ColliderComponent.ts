import { Component } from '../Component';
import { Collider } from '../../Collision/Collider';
import { BuiltinComponentType } from '../ComponentTypes';

/**
 * Describes the physical properties of a physics object
 */
export class ColliderComponent implements Component<BuiltinComponentType.Collider> {
  public readonly type = BuiltinComponentType.Collider;

  public collider: Collider = new Collider(null);

  public clone(): ColliderComponent {
    return new ColliderComponent();
  }
}
