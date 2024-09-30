import Obstacle from "./Obstacle";
import Vector3 from "./Vector3";

export default class Boid extends Obstacle {
  id: number;
  private _velocity: Vector3;

  public get velocity(): Vector3 {
    return this._velocity;
  }

  constructor(id: number, position: Vector3, forward: Vector3) {
    super(position, 0.5);
    this.id = id;
    this.position = position.copy();
    this._velocity = forward.copy().normalize();
  }

  public get rotation(): number {
    /*     console.log(
      (Math.atan2(this.forward.y, this.forward.x) * (180.0 / Math.PI)).toFixed(
        2
      ) + " deg"
    ); */

    return Math.atan2(this.velocity.y, this.velocity.x) + Math.PI;
  }
}
