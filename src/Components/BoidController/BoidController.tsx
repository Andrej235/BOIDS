import "./BoidController.scss";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Boid from "../../ClassDefinitions/Boid";
import BoidRenderer from "../Boid/BoidRenderer";
import Vector2 from "../../ClassDefinitions/Vector2";
import Obstacle from "../../ClassDefinitions/Obstacle";
import ObstacleRenderer from "../Boid/ObstacleRenderer";
import getEdgeAvoidanceForce from "../../Forces/2D/EdgeAvoidance";

type BoidControllerProps = {
  initialBoids: Boid[];
  obstacles: Obstacle[];
  testSteering?: Vector2;
};

type ForceType =
  | "alignment"
  | "cohesion"
  | "separation"
  | "avoidance"
  | "edge-avoidance";

export default function BoidController({
  initialBoids,
  obstacles,
}: BoidControllerProps) {
  return (
    <div className="boid-controller">
      <Canvas
        color="#000"
        camera={{
          fov: 125,
        }}
      >
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

function InnerBoidController({ initialBoids }: BoidControllerProps) {
  const [boids, setBoids] = useState<Boid[]>([]);
  useEffect(() => void setBoids(initialBoids), [initialBoids]);
  const {
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree();

  const MAX_STEERING_FORCE = 0.005;
  const MAX_SPEED = 0.05;

  useEffect(() => {
    const interval = setInterval(() => {
      setBoids((boids) => {
        boids.forEach((boid) => {
          const velocity = boid.velocity;

          const steering = new Vector2(0, 0);
          const forces = getForces(
            boid,
            "alignment",
            "cohesion",
            "separation",
            "edge-avoidance",
            "avoidance"
          );

          steering.add(forces.avoidance);
          // steering.add(forces.separation);
          steering.add(forces.alignment);
          steering.add(forces.cohesion);
          steering.add(forces["edge-avoidance"]);

          steering.truncate(MAX_STEERING_FORCE);

          //Normalizing guarantees a velocity of a same magnitude regardless of direction and steering direction. This is necessary because steering and velocity could have opposite signs i.e. the scene allows negative values
          velocity.add(steering).normalize().truncate(MAX_SPEED);
          boid.position.add(velocity);

          validatePosition(boid);
        });

        return boids.slice();
      });
    }, 1000 / 120);

    return () => clearInterval(interval);
  });

  type ForceTypeObject<T extends ForceType[]> = {
    [P in T[number]]: Vector2;
  };

  const MAX_AVOID_DISTANCE = 1.5;
  const MAX_AVOID_FORCE = 0.00275;
  const MAX_ALIGN_DISTANCE = 1;
  const MAX_ALIGN_FORCE = 0.003;
  const MAX_SEE_AHEAD = 8;
  const MAX_COHESION_DISTANCE = 1;
  const MAX_COHESION_FORCE = 0.001;

  function getForces<T extends ForceType[]>(
    boid: Boid,
    ...types: T
  ): ForceTypeObject<T> {
    if (boids.length < 2) return {} as any;

    const forces: {
      [P in ForceType]: Vector2;
    } = {
      avoidance: new Vector2(0, 0),
      separation: new Vector2(0, 0),
      alignment: new Vector2(0, 0),
      cohesion: new Vector2(0, 0),
      "edge-avoidance": new Vector2(0, 0),
    };

    const velocity = boid.velocity;

    const ahead = boid.position
      .copy()
      .add(velocity.copy().multiply(MAX_SEE_AHEAD));

    const ahead2 = boid.position
      .copy()
      .add(velocity.copy().multiply(MAX_SEE_AHEAD / 2));

    let mostThreatening: Obstacle | null = null;

    for (const current of boids) {
      if (current === boid) continue;

      const distance = current.position.getDistanceTo(boid.position);

      if (types.includes("alignment") && distance < MAX_ALIGN_DISTANCE)
        forces.alignment.add(current.velocity);

      if (types.includes("separation") && distance < MAX_AVOID_DISTANCE)
        forces.separation.add(current.position.copy().subtract(boid.position));

      if (types.includes("cohesion") && distance < MAX_COHESION_DISTANCE)
        forces.cohesion.add(current.position);

      if (types.includes("avoidance")) {
        const collision = lineIntersectsCircle(
          ahead,
          ahead2,
          boid.position,
          current
        );

        if (
          collision &&
          (!mostThreatening ||
            distance < boid.position.getDistanceTo(mostThreatening.position))
        )
          mostThreatening = current;
      }
    }

    forces.alignment.divide(boids.length).normalize().multiply(MAX_ALIGN_FORCE);

    forces.separation
      .divide(-boids.length)
      .normalize()
      .multiply(MAX_AVOID_FORCE);

    forces.cohesion
      .divide(boids.length)
      .subtract(boid.position)
      .normalize()
      .multiply(MAX_COHESION_FORCE);

    if (mostThreatening) {
      forces.avoidance = new Vector2(
        ahead.x - mostThreatening.position.x,
        ahead.y - mostThreatening.position.y
      );

      const distance = boid.position.getDistanceTo(mostThreatening.position);
      const dynamicAvoidanceForceMultiplier =
        (mostThreatening.radius * 0.9) / distance;
      // distance < mostThreatening.radius * 0.9 ? 2 : 1;

      forces.avoidance
        .normalize()
        .multiply(
          MAX_AVOID_FORCE * dynamicAvoidanceForceMultiplier < 0.9
            ? 0.9
            : dynamicAvoidanceForceMultiplier
        );
    }

    if (types.includes("edge-avoidance")) {
      forces["edge-avoidance"] = getEdgeAvoidanceForce(
        boid,
        new Vector2(viewportWidth, viewportHeight)
      );
    }

    return forces;
  }

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
