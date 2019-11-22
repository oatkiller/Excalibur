import { Entity } from '../EntityComponentSystem';
import { MotionComponent } from '../EntityComponentSystem/Components/MotionComponent';
import { TransformComponent } from '../EntityComponentSystem/Components/TransformComponent';
import { DrawingComponent } from '../EntityComponentSystem/Components/DrawingComponent';
import { ParticleComponent } from '../EntityComponentSystem/Components/ParticleComponent';
import { LifetimeComponent } from '../EntityComponentSystem/Components/LifeComponent';
import { Color } from '../Drawing/Color';
import { Vector } from '../Algebra';
import { Drawable } from '../Drawing/Drawable';

export class Particle extends Entity<TransformComponent | MotionComponent | DrawingComponent | ParticleComponent | LifetimeComponent> {
  constructor(config: ParticleArgs) {
    super([new ParticleComponent()]);

    const life = config.life;
    const opacity = config.opacity;
    const endColor = config.endColor;
    const beginColor = config.beginColor;
    const position = config.pos;
    const velocity = config.vel;
    const acceleration = config.acc;
    const startSize = config.startSize;
    const endSize = config.endSize;
    const drawable = config.drawing;

    const { transform, motion, lifetime, particle, drawing } = this.components;

    drawing.add(drawable);

    lifetime.life = life;
    particle.opacity = opacity || particle.opacity;
    particle.endColor = (endColor || config.color || Color.Black).clone();
    particle.beginColor = (beginColor || config.color || Color.Black).clone();
    particle.currentColor = particle.beginColor.clone();
    particle.focus = config.focus;
    particle.focusAccel = config.focusAccel;

    transform.pos = position || transform.pos;
    transform.rotation = config.rotation || 0;
    motion.vel = velocity || motion.vel;
    motion.angularVelocity = config.angularVelocity || 0;
    motion.acc = acceleration || motion.acc;

    particle.startSize = startSize || (config.size !== undefined ? config.size : 0);
    particle.endSize = endSize || (config.size !== undefined ? config.size : 0);

    if (particle.endSize > 0 && particle.startSize > 0) {
      particle.sizeRate = (particle.endSize - particle.startSize) / lifetime.startingLife;
      particle.particleSize = particle.startSize;
    }
  }
}

/**
 * [[include:Constructors.md]]
 */
export interface ParticleArgs {
  pos: Vector;
  rotation: number;
  vel: Vector;
  angularVelocity: number;
  acc: Vector;
  life: number;
  shouldFade: boolean;

  drawing?: Drawable;
  opacity?: number;
  color?: Color;
  endColor?: Color;
  beginColor?: Color;

  size?: number;
  startSize?: number;
  endSize?: number;

  focus: Vector;
  focusAccel: number;
}
