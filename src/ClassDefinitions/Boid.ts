import Obstacle from "./Obstacle";
import Vector2 from "./Vector2";

export default class Boid extends Obstacle {
  id: number;
  private _velocity: Vector2;

  public get velocity(): Vector2 {
    return this._velocity;
  }

  constructor(id: number, position: Vector2, forward: Vector2) {
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
