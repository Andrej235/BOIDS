import Vector2 from "./Vector2";

export default class Boid {
  forward: Vector2;
  position: Vector2;

  constructor(position: Vector2, forward: Vector2) {
    this.position = position;
    this.forward = forward;
  }

  public get rotation(): number {
    console.log(
      (Math.atan2(this.forward.y, this.forward.x) * (180.0 / Math.PI)).toFixed(
        2
      ) + " deg"
    );

    return Math.atan2(this.forward.y, this.forward.x) + Math.PI ;
  }
}
