import { Component } from '../Component';
import { BuiltinComponentType } from '../ComponentTypes';

export class LifetimeComponent implements Component<BuiltinComponentType.Lifetime> {
  public readonly type = BuiltinComponentType.Lifetime;

  public startingLife = 300;
  public currentLife = this.startingLife;
  public set life(life: number) {
    this.startingLife = this.currentLife = life;
  }

  public clone(): LifetimeComponent {
    const component = new LifetimeComponent();
    component.startingLife = this.startingLife;
    component.currentLife = this.startingLife;
    return component;
  }
}
