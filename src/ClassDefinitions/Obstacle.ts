import Vector3 from "./Vector3";

export default class Obstacle {
  position: Vector3;
  radius: number;
  
  constructor(position: Vector3, radius: number) {
    this.position = position;
    this.radius = radius;
  }
}
