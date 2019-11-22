import { Engine } from '../Engine';
import { Sprite } from '../Drawing/Sprite';
import { Color } from '../Drawing/Color';
import { Vector } from '../Algebra';
import * as Util from '../Util/Util';
import * as DrawUtil from '../Util/DrawUtil';
import { Random } from '../Math/Random';

import { Entity } from '../EntityComponentSystem';
import { TransformComponent } from '../EntityComponentSystem/Components/TransformComponent';
import { Particle } from './Particle';
import { InitializeEvent } from '../Events';

/**
 * An enum that represents the types of emitter nozzles
 */
export enum EmitterType {
  /**
   * Constant for the circular emitter type
   */
  Circle,
  /**
   * Constant for the rectangular emitter type
   */
  Rectangle
}

/**
 * Using a particle emitter is a great way to create interesting effects
 * in your game, like smoke, fire, water, explosions, etc. `ParticleEmitter`
 * extend [[Actor]] allowing you to use all of the features that come with.
 *
 * [[include:Particles.md]]
 */
export class ParticleEmitter extends Entity<TransformComponent> {
  private _particlesToEmit: number;
  private _engine: Engine;

  public numParticles: number = 0;

  public get pos() {
    return this.components.transform.pos;
  }

  public particles: Particle[] = [];

  /**
   * Random number generator
   */
  public random: Random;

  /**
   * Gets or sets the isEmitting flag
   */
  public isEmitting: boolean = true;

  /**
   * Gets or sets the minimum particle velocity
   */
  public minVel: number = 0;
  /**
   * Gets or sets the maximum particle velocity
   */
  public maxVel: number = 0;

  /**
   * Gets or sets the acceleration vector for all particles
   */
  public acceleration: Vector = new Vector(0, 0);

  /**
   * Gets or sets the minimum angle in radians
   */
  public minAngle: number = 0;
  /**
   * Gets or sets the maximum angle in radians
   */
  public maxAngle: number = 0;

  /**
   * Gets or sets the emission rate for particles (particles/sec)
   */
  public emitRate: number = 1; //particles/sec
  /**
   * Gets or sets the life of each particle in milliseconds
   */
  public particleLife: number = 2000;
  /**
   * Gets or sets the opacity of each particle from 0 to 1.0
   */
  public opacity: number = 1;
  /**
   * Gets or sets the fade flag which causes particles to gradually fade out over the course of their life.
   */
  public fadeFlag: boolean = false;

  /**
   * Gets or sets the optional focus where all particles should accelerate towards
   */
  public focus: Vector = null;

  /**
   * Gets or sets the acceleration for focusing particles if a focus has been specified
   */
  public focusAccel: number = 1;

  /**
   * Gets or sets the optional starting size for the particles
   */
  public startSize: number = null;

  /**
   * Gets or sets the optional ending size for the particles
   */
  public endSize: number = null;

  /**
   * Gets or sets the minimum size of all particles
   */
  public minSize: number = 5;
  /**
   * Gets or sets the maximum size of all particles
   */
  public maxSize: number = 5;

  /**
   * Gets or sets the beginning color of all particles
   */
  public beginColor: Color = Color.White;
  /**
   * Gets or sets the ending color of all particles
   */
  public endColor: Color = Color.White;

  /**
   * Gets or sets the sprite that a particle should use
   * @warning Performance intensive
   */
  public particleSprite: Sprite = null;

  /**
   * Gets or sets the emitter type for the particle emitter
   */
  public emitterType: EmitterType = EmitterType.Rectangle;

  /**
   * Gets or sets the emitter radius, only takes effect when the [[emitterType]] is [[EmitterType.Circle]]
   */
  public radius: number = 0;

  public width: number = 0;
  public height: number = 0;

  /**
   * Gets or sets the particle rotational speed velocity
   */
  public particleRotationalVelocity: number = 0;

  /**
   * Indicates whether particles should start with a random rotation
   */
  public randomRotation: boolean = false;

  /**
   * @param x       The x position of the emitter
   * @param y       The y position of the emitter
   * @param width   The width of the emitter
   * @param height  The height of the emitter
   */
  constructor(x: number, y: number, width?: number, height?: number);
  constructor(config: ParticleEmitterArgs);
  constructor(xOrConfig?: number | ParticleEmitterArgs, y?: number, width?: number, height?: number) {
    super([new TransformComponent()]);

    if (typeof xOrConfig === 'number') {
      this.pos.x = xOrConfig;
      this.pos.y = y;
      this.width = width || 0;
      this.height = height || 0;
    } else {
      this.pos.x = xOrConfig.x;
      this.pos.y = xOrConfig.y;
      this.width = xOrConfig.width;
      this.height = xOrConfig.height;

      this.particleSprite = xOrConfig.particleSprite;
      this.minVel = xOrConfig.minVel;
      this.maxVel = xOrConfig.maxVel;
      this.minAngle = xOrConfig.minAngle;
      this.maxAngle = xOrConfig.maxAngle;
      this.isEmitting = xOrConfig.isEmitting;
      this.emitRate = xOrConfig.emitRate;
      this.opacity = xOrConfig.opacity;
      this.fadeFlag = xOrConfig.fadeFlag;
      this.particleLife = xOrConfig.particleLife;
      this.maxSize = xOrConfig.maxSize;
      this.minSize = xOrConfig.minSize;
      this.acceleration = xOrConfig.acceleration;
      this.beginColor = xOrConfig.beginColor;
      this.endColor = xOrConfig.endColor;
      this.particleSprite = xOrConfig.particleSprite;
      this.particleRotationalVelocity = xOrConfig.particleRotationalVelocity;
      this.randomRotation = xOrConfig.randomRotation;
    }

    this._particlesToEmit = 0;
    this.random = new Random();
    this.on('initialize', (evt: InitializeEvent) => {
      this._engine = evt.engine;
    });
  }

  /**
   * Causes the emitter to emit particles
   * @param particleCount  Number of particles to emit right now
   */
  public emitParticles(particleCount: number) {
    for (let i = 0; i < particleCount; i++) {
      this._engine.add(this._createParticle());
      // this.particles.push(this._createParticle());
    }
  }

  public clearParticles() {
    this.particles.length = 0;
  }

  // Creates a new particle given the constraints of the emitter
  private _createParticle(): Particle {
    let ranX = 0;
    let ranY = 0;

    const angle = Util.randomInRange(this.minAngle, this.maxAngle, this.random);
    const vel = Util.randomInRange(this.minVel, this.maxVel, this.random);
    const size = this.startSize || Util.randomInRange(this.minSize, this.maxSize, this.random);
    const dx = vel * Math.cos(angle);
    const dy = vel * Math.sin(angle);

    if (this.emitterType === EmitterType.Rectangle) {
      ranX = Util.randomInRange(this.pos.x, this.pos.x + this.width, this.random);
      ranY = Util.randomInRange(this.pos.y, this.pos.y + this.height, this.random);
    } else if (this.emitterType === EmitterType.Circle) {
      const radius = Util.randomInRange(0, this.radius, this.random);
      ranX = radius * Math.cos(angle) + this.pos.x;
      ranY = radius * Math.sin(angle) + this.pos.y;
    }

    const p = new Particle({
      pos: new Vector(ranX, ranY),
      rotation: Util.randomInRange(0, Math.PI * 2, this.random),
      vel: new Vector(dx, dy),
      angularVelocity: this.particleRotationalVelocity,
      acc: this.acceleration,
      life: this.particleLife,
      shouldFade: this.fadeFlag,
      opacity: this.opacity,
      beginColor: this.beginColor,
      endColor: this.endColor,
      startSize: this.startSize,
      endSize: this.endSize,
      size: size,
      drawing: this.particleSprite,
      focus: this.focus !== null ? this.focus.add(new Vector(this.pos.x, this.pos.y)) : undefined,
      focusAccel: this.focusAccel !== undefined ? this.focusAccel : undefined
    });

    return p;
  }

  public onPreUpdate(_engine: Engine, delta: number) {
    if (this.isEmitting) {
      this._particlesToEmit += this.emitRate * (delta / 1000);
      //var numParticles = Math.ceil(this.emitRate * delta / 1000);
      if (this._particlesToEmit > 1.0) {
        this.emitParticles(Math.floor(this._particlesToEmit));
        this._particlesToEmit = this._particlesToEmit - Math.floor(this._particlesToEmit);
      }
    }
  }

  public debugDraw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = Color.Black.toString();
    ctx.fillText('Particles: ' + this.particles.length, this.pos.x, this.pos.y + 20);

    if (this.focus) {
      ctx.fillRect(this.focus.x + this.pos.x, this.focus.y + this.pos.y, 3, 3);
      DrawUtil.line(ctx, Color.Yellow, this.focus.x + this.pos.x, this.focus.y + this.pos.y, this.pos.x, this.pos.y);
      ctx.fillText('Focus', this.focus.x + this.pos.x, this.focus.y + this.pos.y);
    }
  }
}

/**
 * [[include:Constructors.md]]
 */
export interface ParticleEmitterArgs {
  x: number;
  y: number;
  width?: number;
  height?: number;
  isEmitting?: boolean;
  minVel?: number;
  maxVel?: number;
  acceleration?: Vector;
  minAngle?: number;
  maxAngle?: number;
  emitRate?: number;
  particleLife?: number;
  opacity?: number;
  fadeFlag?: boolean;
  focus?: Vector;
  focusAccel?: number;
  startSize?: number;
  endSize?: number;
  minSize?: number;
  maxSize?: number;
  beginColor?: Color;
  endColor?: Color;
  particleSprite?: Sprite;
  emitterType?: EmitterType;
  radius?: number;
  particleRotationalVelocity?: number;
  randomRotation?: boolean;
  random?: Random;
}
