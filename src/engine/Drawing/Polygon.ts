import { Color } from './Color';
import * as Effects from './SpriteEffects';

import { Drawable } from './Drawable';
import { Vector } from '../Algebra';
import { BoundingBox } from '../Collision/Index';

/**
 * Creates a closed polygon drawing given a list of [[Vector]]s.
 *
 * @warning Use sparingly as Polygons are performance intensive
 */
export class Polygon implements Drawable {
  public flipVertical: boolean;
  public flipHorizontal: boolean;
  public drawWidth: number;
  public drawHeight: number;

  public width: number;
  public height: number;

  /**
   * The color to use for the lines of the polygon
   */
  public lineColor: Color;
  /**
   * The color to use for the interior of the polygon
   */
  public fillColor: Color;
  /**
   * The width of the lines of the polygon
   */
  public lineWidth: number = 5;
  /**
   * Indicates whether the polygon is filled or not.
   */
  public filled: boolean = false;

  private _points: Vector[] = [];
  public anchor = Vector.Half;
  public offset = Vector.Zero;
  public rotation: number = 0;
  public scale = Vector.One;

  public get localBounds(): BoundingBox {
    return BoundingBox.fromPoints(this._points)
      .translate(this.offset)
      .scale(this.scale);
  }

  /**
   * @param points  The vectors to use to build the polygon in order
   */
  constructor(points: Vector[]) {
    const bb = BoundingBox.fromPoints(points);

    this.drawWidth = bb.width;
    this.drawHeight = bb.height;

    this.height = this.drawHeight;
    this.width = this.drawWidth;
  }

  /**
   * @notimplemented Effects are not supported on `Polygon`
   */
  public addEffect() {
    // not supported on polygons
  }
  /**
   * @notimplemented Effects are not supported on `Polygon`
   */
  public removeEffect(index: number): void;
  /**
   * @notimplemented Effects are not supported on `Polygon`
   */
  public removeEffect(effect: Effects.SpriteEffect): void;
  /**
   * @notimplemented Effects are not supported on `Polygon`
   */
  public removeEffect() {
    // not supported on polygons
  }

  /**
   * @notimplemented Effects are not supported on `Polygon`
   */
  public clearEffects() {
    // not supported on polygons
  }

  public get loaded() {
    return true;
  }

  public reset() {
    // pass
  }

  public tick(_delta: number) {
    // do nothing
  }

  public draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x + this.drawWidth * this.anchor.x + this.offset.x, y + this.drawHeight * this.anchor.y + this.offset.y);
    ctx.scale(this.scale.x, this.scale.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.lineWidth = this.lineWidth;

    // Iterate through the supplied points and construct a 'polygon'
    const firstPoint = this._points[0];
    ctx.moveTo(firstPoint.x, firstPoint.y);

    let i = 0;
    const len = this._points.length;

    for (i; i < len; i++) {
      ctx.lineTo(this._points[i].x, this._points[i].y);
    }

    ctx.lineTo(firstPoint.x, firstPoint.y);
    ctx.closePath();

    if (this.filled) {
      ctx.fillStyle = this.fillColor.toString();
      ctx.fill();
    }

    ctx.strokeStyle = this.lineColor.toString();

    if (this.flipHorizontal) {
      ctx.translate(this.drawWidth, 0);
      ctx.scale(-1, 1);
    }

    if (this.flipVertical) {
      ctx.translate(0, this.drawHeight);
      ctx.scale(1, -1);
    }

    ctx.stroke();
    ctx.restore();
  }

  public drawWithOptions(options: { ctx: CanvasRenderingContext2D; x: number; y: number; anchor?: Vector; offset?: Vector }) {
    // todo implement
    const { ctx, x, y } = options;
    this.draw(ctx, x, y);
  }
}
