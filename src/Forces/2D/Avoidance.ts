import Boid from "../../ClassDefinitions/Boid";
import Obstacle from "../../ClassDefinitions/Obstacle";
import Vector2 from "../../ClassDefinitions/Vector2";

const MAX_SEE_AHEAD = 8;
const MAX_AVOID_FORCE = 0.00275;

export default function getAvoidanceForce(
  boid: Boid,
  obstacles: Obstacle[]
): Vector2 | null {
  const velocity = boid.velocity;

  const ahead = boid.position
    .copy()
    .add(velocity.copy().multiply(MAX_SEE_AHEAD));

  const ahead2 = boid.position
    .copy()
    .add(velocity.copy().multiply(MAX_SEE_AHEAD / 2));

  const mostThreatening = findMostThreateningObstacle(boid, ahead, ahead2);

  let avoidance: Vector2 | null = null;

  if (mostThreatening) {
    avoidance = new Vector2(
      ahead.x - mostThreatening.position.x,
      ahead.y - mostThreatening.position.y
    );

    const distance = boid.position.getDistanceTo(mostThreatening.position);
    const dynamicAvoidanceForceMultiplier =
      (mostThreatening.radius * 0.9) / distance;
    // distance < mostThreatening.radius * 0.9 ? 2 : 1;

    avoidance
      .normalize()
      .multiply(
        MAX_AVOID_FORCE * dynamicAvoidanceForceMultiplier < 0.9
          ? 0.9
          : dynamicAvoidanceForceMultiplier
      );
  }

  return avoidance;

  function lineIntersectsCircle(
    ahead: Vector2,
    ahead2: Vector2,
    ahead3: Vector2,
    obstacle: Obstacle
  ): boolean {
    return (
      obstacle.position.getDistanceTo(ahead) < obstacle.radius ||
      obstacle.position.getDistanceTo(ahead2) < obstacle.radius ||
      obstacle.position.getDistanceTo(ahead3) < obstacle.radius
    );
  }

  function findMostThreateningObstacle(
    boid: Boid,
    ahead: Vector2,
    ahead2: Vector2
  ): Obstacle | null {
    let mostThreatening: Obstacle | null = null;

    obstacles.forEach((obstacle) => {
      const collision = lineIntersectsCircle(
        ahead,
        ahead2,
        boid.position,
        obstacle
      );

      if (
        collision &&
        (mostThreatening == null ||
          boid.position.getDistanceTo(obstacle.position) <
            boid.position.getDistanceTo(mostThreatening.position))
      )
        mostThreatening = obstacle;
    });

    return mostThreatening;
  }
}
