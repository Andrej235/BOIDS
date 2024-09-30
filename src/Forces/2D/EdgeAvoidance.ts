import Boid from "../../ClassDefinitions/Boid";
import Vector3 from "../../ClassDefinitions/Vector3";

const MAX_SEE_AHEAD = 8;

const MAX_EDGE_DISTANCE = 2;
const MAX_EDGE_FORCE = 21;

export default function getEdgeAvoidanceForce(
  boid: Boid,
  viewportSize: Vector3
): Vector3 {
  const steering = new Vector3(0, 0);

  const velocity = boid.velocity;
  const ahead = boid.position
    .copy()
    .add(velocity.copy().multiply(MAX_SEE_AHEAD));

  if (ahead.x < -viewportSize.x / 2 + MAX_EDGE_DISTANCE)
    steering.x = viewportSize.x / 2;
  else if (ahead.x > viewportSize.x / 2 - MAX_EDGE_DISTANCE)
    steering.x = -viewportSize.x / 2;

  if (ahead.y < -viewportSize.y / 2 + MAX_EDGE_DISTANCE)
    steering.y = viewportSize.y / 2;
  else if (ahead.y > viewportSize.y / 2 - MAX_EDGE_DISTANCE)
    steering.y = -viewportSize.y / 2;

  if (ahead.z < 0 + MAX_EDGE_DISTANCE) steering.z = viewportSize.z;
  else if (ahead.z > viewportSize.z - MAX_EDGE_DISTANCE)
    steering.z = -viewportSize.z;

  return steering.normalize().multiply(MAX_EDGE_FORCE);
}
