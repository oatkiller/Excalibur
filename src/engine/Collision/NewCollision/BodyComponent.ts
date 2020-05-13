import { TransformComponent } from './TransformComponent';
import { Vector } from '../../Algebra';

export class BodyComponent {
  public transform: TransformComponent;
  public motion: number;
  public mass: number;
  public momentOfInertia: number;
  public get inverseMass(): number {
    return this.mass === 0 ? 0 : 1 / this.mass;
  }
  public get inverseMomentOfInertia(): number {
    return this.momentOfInertia === 0 ? 0 : 1 / this.momentOfInertia;
  }
  public allowRotation: boolean = true;

  public applyImpulse(force: Vector, point: Vector) {
    this.transform.vel.add(force);
    if (this.allowRotation) {
      const centerDir = point.sub(this.transform.pos);
      this.transform.angularVelocity -= force.size * this.inverseMomentOfInertia * -centerDir.cross(force.normalize());
    }
  }
}
