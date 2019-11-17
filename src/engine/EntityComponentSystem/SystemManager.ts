import { System } from './System';
import { Engine } from '../Engine';
import { Util, Component } from '..';
import { Scene } from '../Scene';

/**
 * The SystemManager is responsible for keeping track of all systems in a scene.
 * Systems are scene specific
 */
export class SystemManager {
  public systems: System<any>[] = [];
  public _keyToSystem: { [key: string]: System };
  constructor(private _scene: Scene) {}

  /**
   * Adds a system to the manager, it will now be updated every frame
   * @param system
   */
  public addSystem<T extends Component = Component>(system: System<T>): void {
    // validate system has types
    if (!system.types || system.types.length === 0) {
      throw new Error(`Attempted to add a System without any types`);
    }

    const query = this._scene.queryManager.createQuery<T>(system.types);
    this.systems.push(system);
    // TODO polyfill stable .sort(), this mechanism relies on a stable sort
    this.systems.sort((a, b) => a.priority - b.priority);
    query.register(system);
  }

  /**
   * Removes a system from the manager, it will no longer be updated
   * @param system
   */
  public removeSystem(system: System) {
    Util.removeItemFromArray(system, this.systems);
    const query = this._scene.queryManager.getQuery(system.types);
    if (query) {
      query.unregister(system);
      this._scene.queryManager.maybeRemoveQuery(query);
    }
  }

  public clearSystems() {
    // need to walk backwards because we are modifying the collection
    // while iterating
    let length = this.systems.length;
    for (let i = length - 1; i > -1; i--) {
      this.removeSystem(this.systems[i]);
    }
  }

  /**
   * Updates all systems
   * @param engine
   * @param delta
   */
  public updateSystems(engine: Engine, delta: number) {
    for (const s of this.systems) {
      if (s.preupdate) {
        s.preupdate(engine, delta);
      }

      const entities = this._scene.queryManager.getQuery(s.types).entities;
      s.update(entities, delta);

      if (s.postupdate) {
        s.postupdate(engine, delta);
      }
    }
  }
}
