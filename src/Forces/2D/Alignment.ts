import Boid from "../../ClassDefinitions/Boid";
import Vector2 from "../../ClassDefinitions/Vector2";

const MAX_ALIGN_DISTANCE = 1;
const MAX_ALIGN_FORCE = 0.003;

export default function getAlignmentForce(boid: Boid, boids: Boid[]): Vector2 {
  if (boids.length < 2) return new Vector2(0, 0);

  const steering = new Vector2(0, 0);

  boids.forEach((current) => {
    if (current === boid) return;

    if (current.position.getDistanceTo(boid.position) > MAX_ALIGN_DISTANCE)
      return;

    steering.add(current.velocity);
  });

  steering.divide(boids.length);
  return steering.normalize().multiply(MAX_ALIGN_FORCE);
}
