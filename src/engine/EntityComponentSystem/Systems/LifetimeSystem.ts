import { System } from '../System';
import { Entity } from '../Entity';
import { BuiltinComponentType } from '../ComponentTypes';
import { LifetimeComponent } from '../Components/LifeComponent';

export class LifetimeSystem extends System<LifetimeComponent> {
  public readonly types = [BuiltinComponentType.Lifetime];

  update(entities: Entity<LifetimeComponent>[], delta: number): void {
    for (const e of entities) {
      e.components.lifetime.currentLife -= delta;
      if (e.components.lifetime.currentLife <= 0) {
        e.kill();
      }
    }
  }
}
