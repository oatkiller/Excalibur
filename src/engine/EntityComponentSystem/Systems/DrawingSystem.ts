import { System, isAddedSystemEntity, isRemoveSystemEntity, AddedEntity, RemovedEntity } from '../System';
import { ComponentType, BuiltinComponentType } from '../ComponentTypes';
import { Entity } from '../Entity';
import { Engine } from '../../Engine';
import { TransformComponent, CoordPlane } from '../Components/TransformComponent';
import { DrawingComponent } from '../Components/DrawingComponent';
import { PreDrawEvent, PostDrawEvent, ExitViewPortEvent, EnterViewPortEvent } from '../../Events';
import { SortedList } from '../../Util/SortedList';
import { OffscreenComponent } from '../Components/OffscreenComponent';
import { Vector } from '../../Algebra';
import { hasPreDraw, hasPostDraw } from '../../Interfaces/LifecycleEvents';

export class DrawingSystem extends System {
  readonly types: ComponentType[] = [BuiltinComponentType.Transform, BuiltinComponentType.Drawing];

  private _sortedDrawingTree = new SortedList<Entity<TransformComponent | DrawingComponent>>((e) => {
    return e.components.transform.z;
  });

  public ctx: CanvasRenderingContext2D;
  constructor(public engine: Engine) {
    super();
    this.ctx = engine.ctx;
  }

  notify(message: AddedEntity | RemovedEntity) {
    if (isAddedSystemEntity(message)) {
      this._sortedDrawingTree.add(message.data as Entity<TransformComponent | DrawingComponent>);
      this._updateZ(message.data.components[BuiltinComponentType.Transform] as TransformComponent);
    }

    if (isRemoveSystemEntity(message)) {
      this._sortedDrawingTree.removeByComparable(message.data as Entity<TransformComponent | DrawingComponent>);
    }
  }

  private _updateZ(transform: TransformComponent) {
    transform.old.z = transform.z;
  }

  /**
   * Update is called with enities that have a transform and drawing component
   */
  update(_entities: Entity<TransformComponent | DrawingComponent>[], delta: number): void {
    for (const e of _entities) {
      const transform = e.components.transform;
      const drawing = e.components.drawing;

      // TODO perhaps observe this z-index change?
      this._applyZIndex(e, transform);
      this._applyOffscreenCulling(e, transform, drawing);
    }

    const sortedEntities = this._sortedDrawingTree.list();

    for (const entity of sortedEntities) {
      const transform = entity.components.transform;
      const drawing = entity.components.drawing;

      // If offscreen, skip drawing
      if (entity.components.offscreen) {
        continue;
      }

      this._pushCameraTransform(transform);

      if (drawing.current) {
        drawing.current.tick(delta);
      }

      if (!entity.components[BuiltinComponentType.Offscreen]) {
        // Setup transform
        this.ctx.save();
        this.ctx.translate(transform.pos.x, transform.pos.y);
        this.ctx.rotate(transform.rotation);
        this.ctx.scale(transform.scale.x, transform.scale.x);

        if (hasPreDraw(entity)) {
          // only gets called if the entity has a Drawing component :(
          entity.emit('predraw', new PreDrawEvent(this.ctx, delta, entity));
          entity.onPreDraw(this.ctx, delta);
        }
        if (drawing.visible) {
          drawing.onPreDraw(this.ctx, delta);

          if (drawing.current && drawing.current.loaded) {
            drawing.current.drawWithOptions({
              ctx: this.ctx,
              x: 0,
              y: 0,
              anchor: drawing.anchor,
              offset: drawing.offset,
              opacity: drawing.opacity
            });
          }

          drawing.onPostDraw(this.ctx, delta);
        }
        if (hasPostDraw(entity)) {
          entity.emit('postdraw', new PostDrawEvent(this.ctx, delta, entity));
          entity.onPostDraw(this.ctx, delta);
        }

        this.ctx.restore();
      }

      this._popCameraTransform(transform);
    }
  }

  preupdate(_engine: Engine, _delta: number): void {
    // Clear frame
    this.ctx.clearRect(0, 0, _engine.canvasWidth, _engine.canvasHeight);
    this.ctx.fillStyle = _engine.backgroundColor.toString();
    this.ctx.fillRect(0, 0, _engine.canvasWidth, _engine.canvasHeight);
  }

  private _pushCameraTransform(transform: TransformComponent) {
    // Establish camera offset per entity
    if (transform && transform.coordPlane === CoordPlane.World) {
      this.ctx.save();
      if (this.engine && this.engine.currentScene && this.engine.currentScene.camera) {
        this.engine.currentScene.camera.draw(this.ctx);
      }
    }
  }

  private _popCameraTransform(transform: TransformComponent) {
    if (transform && transform.coordPlane === CoordPlane.World) {
      // Apply camera world offset
      this.ctx.restore();
    }
  }

  private _applyZIndex(entity: Entity<TransformComponent | DrawingComponent>, transform: TransformComponent) {
    // Handle z index
    if (transform.z !== transform.old.z) {
      const tempZ = transform.z;
      transform.z = transform.old.z;
      this._sortedDrawingTree.removeByComparable(entity);
      transform.z = tempZ;
      this._sortedDrawingTree.add(entity);
      this._updateZ(transform);
    }
  }

  // Move to a separate system?
  private _applyOffscreenCulling(
    entity: Entity<TransformComponent | DrawingComponent>,
    transform: TransformComponent,
    drawing: DrawingComponent
  ) {
    // Handle offscreen culling
    if (drawing && drawing.current) {
      const offscreen = !this.engine.currentScene.camera.viewport.intersect(
        drawing.current.localBounds
          .scale(transform.scale)
          .rotate(transform.rotation)
          .translate(transform.pos)
          .translate(transform.coordPlane === CoordPlane.Screen ? this.engine.currentScene.camera.viewport.topLeft : Vector.Zero)
      );

      // Add offscreen component & emit events
      if (!entity.components.offscreen && offscreen) {
        entity.emit('exitviewport', new ExitViewPortEvent(entity));
        entity.addComponent(new OffscreenComponent());
      }

      if (entity.components.offscreen && !offscreen) {
        entity.emit('enterviewport', new EnterViewPortEvent(entity));
        entity.removeComponent(BuiltinComponentType.Offscreen);
      }
    }
  }
}
