import Boid from "../../ClassDefinitions/Boid";
import Vector2 from "../../ClassDefinitions/Vector2";

const MAX_SEE_AHEAD = 8;

const MAX_EDGE_DISTANCE = 2;
const MAX_EDGE_FORCE = 21;

export default function getEdgeAvoidanceForce(
  boid: Boid,
  viewportSize: Vector2
): Vector2 {
  const steering = new Vector2(0, 0);

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

  return steering.normalize().multiply(MAX_EDGE_FORCE);
}
