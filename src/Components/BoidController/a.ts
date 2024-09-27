import Boid from "../../ClassDefinitions/Boid";
import Obstacle from "../../ClassDefinitions/Obstacle";
import Vector2 from "../../ClassDefinitions/Vector2";

const obstacles: any[] = [];

export function oldCollisionAvoidance(boid: Boid): Vector2 {
  const MAX_SEE_AHEAD = 2;
  const MAX_AVOID_FORCE = 0.5;

  const velocity = boid.velocity.copy().normalize();
  const ahead = boid.position.copy().add(velocity.multiply(MAX_SEE_AHEAD));
  const ahead2 = boid.position.copy().add(velocity.multiply(MAX_SEE_AHEAD / 2));

  const mostThreatening = findMostThreateningObstacle(boid, ahead, ahead2);
  const avoidance = new Vector2(0, 0);

  if (mostThreatening) {
    console.log(mostThreatening);

    avoidance.x = ahead.x - mostThreatening.position.x;
    avoidance.y = ahead.y - mostThreatening.position.y;

    avoidance.normalize();
    avoidance.multiply(MAX_AVOID_FORCE);
    // console.log(boid.position, avoidance);
  }

  return avoidance;
}

function lineIntersectsCircle(
  ahead: Vector2,
  ahead2: Vector2,
  otherBoid: Obstacle
): boolean {
  return (
    otherBoid.position.getDistanceTo(ahead) <= 0.5 ||
    otherBoid.position.getDistanceTo(ahead2) <= 0.5
  );
}

function findMostThreateningObstacle(
  boid: Boid,
  ahead: Vector2,
  ahead2: Vector2
): Obstacle | null {
  let mostThreatening: Obstacle | null = null;

  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    const collision = lineIntersectsCircle(ahead, ahead2, obstacle);

    if (
      collision &&
      (mostThreatening == null ||
        boid.position.getDistanceTo(obstacle.position) <
          boid.position.getDistanceTo(mostThreatening.position))
    ) {
      mostThreatening = obstacle;
    }
  }

  return mostThreatening;
}
