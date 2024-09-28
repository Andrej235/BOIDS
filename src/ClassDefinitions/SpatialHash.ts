import Boid from "./Boid";
import Vector2 from "./Vector2";

export default class SpatialHash {
  buckets: Map<number, Boid[]>;
  // private min: Vector2;
  private max: Vector2;
  private cellSize: number;
  private size: Vector2;
  // private numberOfBuckets: number;
  private conversionFactor: number;

  constructor(min: Vector2, max: Vector2, cellSize: number) {
    this.buckets = new Map();

    // this.min = min;
    this.max = max;
    this.cellSize = cellSize;
    this.size = max.copy().subtract(min).divide(cellSize).floor();
    // this.numberOfBuckets = this.size.x * this.size.y;
    this.conversionFactor = 1 / this.cellSize;
  }

  construct(boids: Boid[]): SpatialHash {
    this.buckets = new Map();

    boids.forEach((boid) => {
      const hash = this.hash(boid.position.x, boid.position.y);
      const bucket = this.buckets.get(hash);

      if (bucket) bucket.push(boid);
      else this.buckets.set(hash, [boid]);
    });

    return this;
  }

  private hash(x: number, y: number) {
    return (
      Math.floor(x * this.conversionFactor + this.max.x) +
      Math.floor(y * this.conversionFactor + this.max.y) * this.size.x
    );
  }

  getInProximity(position: Vector2): Boid[] {
    const middleHash = this.hash(position.x, position.y);
    let bucket: Boid[] = [];

    for (
      let i = middleHash - this.size.x;
      i <= middleHash + this.size.x;
      i += this.size.x
    ) {
      bucket = bucket?.concat(this.buckets.get(i - 1) ?? []);
      bucket = bucket?.concat(this.buckets.get(i) ?? []);
      bucket = bucket?.concat(this.buckets.get(i + 1) ?? []);
    }

    return Array.from(new Set(bucket));
  }

  getBucket(position: Vector2) {
    return this.buckets.get(this.hash(position.x, position.y));
  }
}
