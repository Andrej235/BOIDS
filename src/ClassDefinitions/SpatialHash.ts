import Boid from "./Boid";
import Vector3 from "./Vector3";

export default class SpatialHash {
  buckets: Map<number, Boid[]>;
  private size: Vector3;
  private cellSize: number;
  private bucketsCount: number;

  constructor(min: Vector3, max: Vector3, cellSize: number) {
    this.buckets = new Map();

    this.size = max.copy().subtract(min).divide(cellSize).floor();
    this.cellSize = cellSize;
    this.bucketsCount = this.size.x * this.size.y * this.size.z;
  }

  construct(boids: Boid[]): SpatialHash {
    this.buckets = new Map();

    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i];

      const hash = this.hash(boid.position.x, boid.position.y, boid.position.z);
      const bucket = this.buckets.get(hash);

      if (bucket) bucket.push(boid);
      else this.buckets.set(hash, [boid]);
    }

    return this;
  }

  /*   private hash(x: number, y: number) {
    return (
      Math.floor(x * this.conversionFactor + this.max.x) +
      Math.floor(y * this.conversionFactor + this.max.y) * this.size.x
    );
  }
 */
  private hash(x: number, y: number, z: number): number {
    // Use a large prime number to reduce collisions
    const prime1 = 73856093;
    const prime2 = 19349663;
    const prime3 = 83492791;

    // Combine the components into a unique index
    const hashValue = (x * prime1) ^ (y * prime2) ^ (z * prime3);

    return hashValue / this.bucketsCount;
  }

  private getNeighbors(x: number, y: number, z: number): number[] {
    const neighbors: number[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const neighborPosition = new Vector3(
            x + dx * this.cellSize,
            y + dy * this.cellSize,
            z + dz * this.cellSize
          );

          const neighborIndex = this.hash(
            neighborPosition.x,
            neighborPosition.y,
            neighborPosition.z
          );

          neighbors.push(neighborIndex);
        }
      }
    }

    return neighbors;
  }

  getInProximity(position: Vector3): Boid[] {
    return this.getNeighbors(position.x, position.y, position.z)
      .map((neighborIndex) => this.buckets.get(neighborIndex))
      .flatMap((bucket) => bucket ?? []);
  }

  getBucket(position: Vector3) {
    return this.buckets.get(this.hash(position.x, position.y, position.z));
  }
}
