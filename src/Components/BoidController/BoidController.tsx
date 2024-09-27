import "./BoidController.scss";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Boid from "../../ClassDefinitions/Boid";
import BoidRenderer from "../Boid/BoidRenderer";
import Vector2 from "../../ClassDefinitions/Vector2";
import Obstacle from "../../ClassDefinitions/Obstacle";
import ObstacleRenderer from "../Boid/ObstacleRenderer";

type BoidControllerProps = {
  initialBoids: Boid[];
  obstacles: Obstacle[];
  testSteering?: Vector2;
};

export default function BoidController({
  initialBoids,
  obstacles,
}: BoidControllerProps) {
  return (
    <div className="boid-controller">
      <Canvas color="#000">
        <InnerBoidController
          initialBoids={initialBoids}
          obstacles={obstacles}
        />

        {obstacles.map((obstacle, i) => (
          <ObstacleRenderer key={i} obstacle={obstacle} />
        ))}

        <axesHelper scale={50} />
      </Canvas>
    </div>
  );
}

function InnerBoidController({ initialBoids, obstacles }: BoidControllerProps) {
  const [boids, setBoids] = useState<Boid[]>([]);
  useEffect(() => void setBoids(initialBoids), [initialBoids]);
  const {
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree();

  const MAX_STEERING_FORCE = 0.005;
  const MAX_SPEED = 0.05;
  const MAX_SEE_AHEAD = 8;
  const MAX_AVOID_FORCE = 0.00275;
  const MAX_ALIGNMENT_DISTANCE = 1.5;

  useFrame(() => {
    setBoids((boids) => {
      boids.forEach((boid) => {
        const velocity = boid.velocity;

        const steering = new Vector2(0, 0);
        steering.add(getAvoidanceForce(boid));
        steering.add(getAlignmentForce(boid));

        steering.truncate(MAX_STEERING_FORCE);

        //Normalizing guarantees a velocity of a same magnitude regardless of direction and steering direction. This is necessary because steering and velocity could have opposite signs i.e. the scene allows negative values
        velocity.add(steering).normalize().truncate(MAX_SPEED);
        boid.position.add(velocity);

        validatePosition(boid);
      });

      return boids.slice();
    });
  });

  function getAvoidanceForce(boid: Boid): Vector2 | null {
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

      [...obstacles, ...boids.filter((b) => b !== boid)].forEach((obstacle) => {
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

  function getAlignmentForce(boid: Boid): Vector2 {
    if (boids.length < 2) return new Vector2(0, 0);

    const steering = new Vector2(0, 0);

    boids.forEach((current) => {
      if (current === boid) return;

      if (
        current.position.getDistanceTo(boid.position) > MAX_ALIGNMENT_DISTANCE
      )
        return;

      steering.add(current.velocity);
    });

    steering.divide(boids.length);
    return steering;
  }

  function validatePosition(boid: Boid) {
    if (boid.position.x < -viewportWidth / 2)
      boid.position.x = viewportWidth / 2;
    else if (boid.position.x > viewportWidth / 2)
      boid.position.x = -viewportWidth / 2;

    if (boid.position.y < -viewportHeight / 2)
      boid.position.y = viewportHeight / 2;
    else if (boid.position.y > viewportHeight / 2)
      boid.position.y = -viewportHeight / 2;
  }

  return (
    <>
      {boids.map((boid, i) => (
        <BoidRenderer key={i} boid={boid} />
      ))}
    </>
  );
}
