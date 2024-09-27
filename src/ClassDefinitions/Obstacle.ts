import Vector2 from "./Vector2";

export default class Obstacle {
  position: Vector2;
  radius: number;
  
  constructor(position: Vector2, radius: number) {
    this.position = position;
    this.radius = radius;
  }
}
