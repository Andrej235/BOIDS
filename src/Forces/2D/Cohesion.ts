import Boid from "../../ClassDefinitions/Boid";
import Vector2 from "../../ClassDefinitions/Vector2";

const MAX_COHESION_DISTANCE = 1;
const MAX_COHESION_FORCE = 0.001;

export default function getCohesionForce(boid: Boid, boids: Boid[]): Vector2 {
  if (boids.length < 2) return new Vector2(0, 0);

  const steering = new Vector2(0, 0);

  boids.forEach((current) => {
    if (current === boid) return;

    if (current.position.getDistanceTo(boid.position) > MAX_COHESION_DISTANCE)
      return;

    steering.add(current.position);
  });

  steering.divide(boids.length);
  steering.subtract(boid.position);
  return steering.normalize().multiply(MAX_COHESION_FORCE);
}
