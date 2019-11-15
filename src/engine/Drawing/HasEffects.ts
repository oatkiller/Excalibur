import { SpriteEffect } from './SpriteEffects';

export interface HasEffects {
  /**
   * Adds a new [[SpriteEffect]] to this drawing.
   * @param effect  Effect to add to the this drawing
   */
  addEffect(effect: SpriteEffect): void;

  /**
   * Removes an effect [[SpriteEffect]] from this drawing.
   * @param effect  Effect to remove from this drawing
   */
  removeEffect(effect: SpriteEffect): void;

  /**
   * Removes an effect by index from this drawing.
   * @param index  Index of the effect to remove from this drawing
   */
  removeEffect(index: number): void;
  removeEffect(param: any): void;

  /**
   * Clears all effects from the drawing and return it to its original state.
   */
  clearEffects(): void;
}
