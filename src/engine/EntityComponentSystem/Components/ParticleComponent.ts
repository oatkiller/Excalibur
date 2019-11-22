import { Component } from '../Component';
import { BuiltinComponentType } from '../ComponentTypes';
import { Entity } from '../Entity';
import { Color } from '../../Drawing/Color';
import { Vector } from '../../Algebra';
import { TransformComponent } from './TransformComponent';
import { MotionComponent } from './MotionComponent';
import { LifetimeComponent } from './LifeComponent';
import { DrawingComponent } from './DrawingComponent';

export class ParticleComponent implements Component<BuiltinComponentType.Particle> {
  public readonly type = BuiltinComponentType.Particle;
  public dependencies = [TransformComponent, MotionComponent, LifetimeComponent, DrawingComponent];
  public owner: Entity = null;

  public shouldFade: boolean = false;
  public beginColor: Color = Color.Black;
  public endColor: Color = Color.Black;
  public currentColor: Color = Color.Black;

  public get rRate() {
    return (this.endColor.r - this.beginColor.r) / this._life;
  }

  public get gRate() {
    return (this.endColor.g - this.beginColor.g) / this._life;
  }

  public get bRate() {
    return (this.endColor.b - this.beginColor.b) / this._life;
  }

  public get aRate() {
    return this.opacity / this._life;
  }

  public startSize: number;
  public endSize: number;
  public sizeRate: number;
  public particleSize: number;
  public focus: Vector;
  public focusAccel: number;
  public set opacity(opacity: number) {
    this._drawing.opacity = opacity;
  }

  public get opacity() {
    return this._drawing.opacity;
  }

  private _life: number;
  private _drawing: DrawingComponent;

  onAdd(e: Entity<LifetimeComponent | DrawingComponent>) {
    this._life = e.components.lifetime.startingLife;
    this._drawing = e.components.drawing;
  }

  clone(): ParticleComponent {
    const component = new ParticleComponent();
    component.beginColor = this.beginColor.clone();
    return component;
  }
}
