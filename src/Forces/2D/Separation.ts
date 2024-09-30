import Boid from "../../ClassDefinitions/Boid";
import Vector3 from "../../ClassDefinitions/Vector3";

const MAX_AVOID_DISTANCE = 1.5;
const MAX_AVOID_FORCE = 0.00275;

export default function getCollectiveAvoidanceForce(
  boid: Boid,
  boids: Boid[]
): Vector3 {
  if (boids.length < 2) return new Vector3(0, 0);

  const steering = new Vector3(0, 0);

  boids.forEach((current) => {
    if (current === boid) return;

    if (current.position.getDistanceTo(boid.position) > MAX_AVOID_DISTANCE)
      return;

    steering.add(current.position.copy().subtract(boid.position));
  });

  steering.divide(boids.length);
  steering.multiply(-1);
  return steering.normalize().multiply(MAX_AVOID_FORCE);
}
