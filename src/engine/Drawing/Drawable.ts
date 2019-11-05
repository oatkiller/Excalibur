import { Vector } from '../Algebra';
import { HasEffects } from './HasEffects';
import { BoundingBox } from '../Collision/Index';

export interface DrawOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  anchor?: Vector;
  offset?: Vector;
  opacity?: number;
}

/**
 * Interface for implementing anything in Excalibur that can be drawn to the screen.
 */
export interface Drawable extends HasEffects {
  /**
   * Indicates whether the drawing is to be flipped vertically
   */
  flipVertical: boolean;
  /**
   * Indicates whether the drawing is to be flipped horizontally
   */
  flipHorizontal: boolean;
  /**
   * Indicates the current width of the drawing in pixels, factoring in the scale
   */
  drawWidth: number;
  /**
   * Indicates the current height of the drawing in pixels, factoring in the scale
   */
  drawHeight: number;

  /**
   * Indicates the natural width of the drawing in pixels, this is the original width of the source image
   */
  width: number;
  /**
   * Indicates the natural height of the drawing in pixels, this is the original height of the source image
   */
  height: number;

  /**
   * Gets or sets the point about which to apply transformations to the drawing relative to the
   * top left corner of the drawing.
   */
  anchor: Vector;

  /**
   * Gets or sets the pixel offset to apply to the drawing
   */
  offset: Vector;

  /**
   * Gets or sets the scale transformation
   */
  scale: Vector;

  /**
   * Sets the current rotation transformation for the drawing.
   */
  rotation: number;

  /**
   * Gets the load status of the drawable
   */
  loaded: boolean;

  /**
   * Gets the bounds for the drawable
   */
  localBounds: BoundingBox;

  /**
   * Tick the internal state of the drawable (if any)
   */
  tick(delta: number): void;

  /**
   * Resets the internal state of the drawable (if any)
   */
  reset(): void;

  /**
   * Draws the sprite appropriately to the 2D rendering context.
   * @param ctx  The 2D rendering context
   * @param x    The x coordinate of where to draw
   * @param y    The y coordinate of where to draw
   */
  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;

  /**
   * Draws the sprite with custom options to override internals
   * @param options
   */
  drawWithOptions(options: DrawOptions): void;
}
