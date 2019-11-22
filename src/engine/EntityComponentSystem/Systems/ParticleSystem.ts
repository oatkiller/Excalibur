import { System } from '../System';
import { Entity } from '../Entity';
import { BuiltinComponentType } from '../ComponentTypes';
import { LifetimeComponent } from '../Components/LifeComponent';
import { ParticleComponent } from '../Components/ParticleComponent';
import { clamp } from '../../Util/Util';
import { TransformComponent } from '../Components/TransformComponent';
import { MotionComponent } from '../Components/MotionComponent';

type Particles = TransformComponent | MotionComponent | LifetimeComponent | ParticleComponent;
export class ParticleSystem extends System<Particles> {
  public readonly types = [BuiltinComponentType.Lifetime, BuiltinComponentType.Particle];

  update(entities: Entity<Particles>[], delta: number): void {
    for (const e of entities) {
      const { transform, motion, particle, lifetime } = e.components;
      if (particle.shouldFade) {
        particle.opacity = clamp(particle.aRate * lifetime.currentLife, 0.0001, 1);
      }

      if (particle.startSize > 0 && particle.endSize > 0) {
        particle.particleSize = clamp(
          particle.sizeRate * delta + particle.particleSize,
          Math.min(particle.startSize, particle.endSize),
          Math.max(particle.startSize, particle.endSize)
        );
      }

      particle.currentColor.r = clamp(particle.currentColor.r + particle.rRate * delta, 0, 255);
      particle.currentColor.g = clamp(particle.currentColor.g + particle.gRate * delta, 0, 255);
      particle.currentColor.b = clamp(particle.currentColor.b + particle.bRate * delta, 0, 255);
      particle.currentColor.a = clamp(particle.opacity, 0.0001, 1);

      if (particle.focus) {
        const accel = particle.focus
          .sub(transform.pos)
          .normalize()
          .scale(particle.focusAccel)
          .scale(delta / 1000);

        motion.acc = accel;
      }
    }
  }
}
