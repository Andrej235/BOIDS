export default class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  remap(fromMax: Vector3, toMax: Vector3) {
    this.x = (this.x / fromMax.x) * toMax.x;
    this.y = (this.y / fromMax.y) * toMax.y;
    this.z = (this.z / fromMax.z) * toMax.z;
    return this;
  }

  remapToNegative(fromMax: Vector3) {
    this.x = this.x - fromMax.x / 2;
    this.y = this.y - fromMax.y / 2;
    this.z = this.z - fromMax.z / 2;
    return this;
  }

  remapToPositive(fromMax: Vector3) {
    this.x = this.x + fromMax.x / 2;
    this.y = this.y + fromMax.y / 2;
    this.z = this.z + fromMax.z / 2;
    return this;
  }

  truncate(max: number) {
    const magnitude = this.getMagnitude();

    if (magnitude > max) this.divide(magnitude).multiply(max);

    return this;
  }

  copy() {
    return new Vector3(this.x, this.y, this.z);
  }

  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  add(other: Vector3 | null) {
    if (!other) return this;

    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  subtract(other: Vector3) {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
    return this;
  }

  multiply(value: number) {
    this.x *= value;
    this.y *= value;
    this.z *= value;
    return this;
  }

  multipleByVector(other: Vector3) {
    this.x *= other.x;
    this.y *= other.y;
    this.z *= other.z;
    return this;
  }

  divide(value: number) {
    this.x /= value;
    this.y /= value;
    this.z /= value;
    return this;
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    this.z = Math.floor(this.z);
    return this;
  }

  divideByVector(other: Vector3) {
    this.x /= other.x;
    this.y /= other.y;
    this.z /= other.z;
    return this;
  }

  normalize() {
    const length = this.getMagnitude();
    this.x /= length ? length : 1;
    this.y /= length ? length : 1;
    this.z /= length ? length : 1;
    return this;
  }

  getDistanceTo(other: Vector3): number {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) +
        Math.pow(this.y - other.y, 2) +
        Math.pow(this.z - other.z, 2)
    );
  }
}
