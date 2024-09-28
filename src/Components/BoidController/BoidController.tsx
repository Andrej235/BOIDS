import "./BoidController.scss";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Boid from "../../ClassDefinitions/Boid";
import BoidRenderer from "../Boid/BoidRenderer";
import Vector2 from "../../ClassDefinitions/Vector2";
import Obstacle from "../../ClassDefinitions/Obstacle";
import ObstacleRenderer from "../Boid/ObstacleRenderer";
import getAvoidanceForce from "../../Forces/2D/Avoidance";
import getSeparationForce from "../../Forces/2D/Separation";
import getAlignmentForce from "../../Forces/2D/Alignment";
import getCohesionForce from "../../Forces/2D/Cohesion";
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
          fov: 100,
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

function InnerBoidController({ initialBoids, obstacles }: BoidControllerProps) {
  const [boids, setBoids] = useState<Boid[]>([]);
  useEffect(() => void setBoids(initialBoids), [initialBoids]);
  const {
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree();

  const MAX_STEERING_FORCE = 0.005;
  const MAX_SPEED = 0.05;

  useFrame(() => {
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
        steering.add(forces.separation);
        steering.add(forces.alignment);
        steering.add(forces.cohesion);
        steering.add(forces["edge-avoidance"]);

        // steering.add(getAvoidanceForce(boid));
        // steering.add(getCollectiveAvoidanceForce(boid));
        // steering.add(getAlignmentForce(boid));
        // steering.add(getCohesionForce(boid));
        // steering.add(getEdgeAvoidanceForce(boid));

        steering.truncate(MAX_STEERING_FORCE);

        //Normalizing guarantees a velocity of a same magnitude regardless of direction and steering direction. This is necessary because steering and velocity could have opposite signs i.e. the scene allows negative values
        velocity.add(steering).normalize().truncate(MAX_SPEED);
        boid.position.add(velocity);

        validatePosition(boid);
      });

      return boids.slice();
    });
  });

  type ForceTypeObject<T extends ForceType[]> = {
    [P in T[number]]: Vector2;
  };

  function getForces<T extends ForceType[]>(
    boid: Boid,
    ...types: T
  ): ForceTypeObject<T> {
    const forces = {} as any;

    new Set(types).forEach((type) => {
      forces[type] = getSingleForce(type, boid);
    });

    return forces;

    function getSingleForce(type: ForceType, boid: Boid) {
      switch (type) {
        case "avoidance":
          return getAvoidanceForce(boid, [
            ...obstacles,
            ...boids.filter((b) => b !== boid),
          ]);

        case "separation":
          return getSeparationForce(boid, boids);

        case "alignment":
          return getAlignmentForce(boid, boids);

        case "cohesion":
          return getCohesionForce(boid, boids);

        case "edge-avoidance":
          return getEdgeAvoidanceForce(
            boid,
            new Vector2(viewportWidth, viewportHeight)
          );

        default:
          return new Vector2(0, 0);
      }
    }
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
