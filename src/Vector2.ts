export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  remap(fromMax: Vector2, toMax: Vector2) {
    this.x = (this.x / fromMax.x) * toMax.x;
    this.y = (this.y / fromMax.y) * toMax.y;
    return this;
  }

  remapToNegative(fromMax: Vector2) {
    this.x = this.x - fromMax.x / 2;
    this.y = this.y - fromMax.y / 2;
    return this;
  }

  remapToPositive(fromMax: Vector2) {
    this.x = this.x + fromMax.x / 2;
    this.y = this.y + fromMax.y / 2;
    return this;
  }

  truncate(max: number) {
    const magnitude = this.getMagnitude();

    if (magnitude > max) this.divide(magnitude).multiply(max);

    return this;
  }

  copy() {
    return new Vector2(this.x, this.y);
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  add(other: Vector2) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subtract(other: Vector2) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  multiply(value: number) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  multipleByVector(other: Vector2) {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  divide(value: number) {
    this.x /= value;
    this.y /= value;
    return this;
  }

  divideByVector(other: Vector2) {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }

  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= length ? length : 1;
    this.y /= length ? length : 1;
    return this;
  }
}
