import "./BoidController.scss";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import Boid from "../../ClassDefinitions/Boid";
import BoidRenderer from "../Boid/BoidRenderer";
import Vector2 from "../../ClassDefinitions/Vector2";
import Obstacle from "../../ClassDefinitions/Obstacle";
import ObstacleRenderer from "../Boid/ObstacleRenderer";
import getEdgeAvoidanceForce from "../../Forces/2D/EdgeAvoidance";
import SpatialHash from "../../ClassDefinitions/SpatialHash";

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
          fov: 127,
        }}
      >
        <InnerBoidController
          initialBoids={initialBoids}
          obstacles={obstacles}
        />

        {obstacles.map((obstacle, i) => (
          <ObstacleRenderer key={i} obstacle={obstacle} />
        ))}

        {/* <axesHelper scale={50} /> */}

        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}

function InnerBoidController({ initialBoids }: BoidControllerProps) {
  const [selectedBoids, setSelectedBoids] = useState<Boid[]>([]);

  const [boids, setBoids] = useState<Boid[]>([]);
  useEffect(() => void setBoids(initialBoids), [initialBoids]);
  const {
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree();

  const viewportSize = new Vector2(viewportWidth, viewportHeight);
  const min = new Vector2(-viewportWidth / 2, -viewportHeight / 2);
  const max = new Vector2(viewportWidth / 2, viewportHeight / 2);
  const cellSize = 2;

  const MAX_STEERING_FORCE = 0.005;
  const MAX_SPEED = 5;

  useFrame(({}, delta) => {
    spatialHash.current = spatialHash.current.construct(boids);

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
        velocity
          .add(steering)
          .normalize()
          .truncate(MAX_SPEED * delta);
        boid.position.add(velocity);

        validatePosition(boid);
      });

      return boids.slice();
    });
  });

  const spatialHash = useRef<SpatialHash>(new SpatialHash(min, max, cellSize));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const mousePos = new Vector2(e.clientX, window.innerHeight - e.clientY)
        .remap(new Vector2(window.innerWidth, window.innerHeight), viewportSize)
        .remapToNegative(viewportSize);

      const inProximity = spatialHash.current.getInProximity(mousePos);
      setSelectedBoids(inProximity);
      console.log(inProximity);
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
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

    const inProximity = spatialHash.current.getInProximity(boid.position);
    if (inProximity.length < 2) return {} as any;

    for (const current of inProximity) {
      if (current === boid) continue;

      const distance = current.position.getDistanceTo(boid.position);

      if (types.includes("alignment") && distance < MAX_ALIGN_DISTANCE)
        forces.alignment.add(current.velocity);

      if (types.includes("separation") && distance < MAX_AVOID_DISTANCE)
        forces.separation.add(current.position.copy().subtract(boid.position));

      if (types.includes("cohesion") && distance < MAX_COHESION_DISTANCE)
        forces.cohesion.add(current.position);
    }

    for (const current of spatialHash.current.getBucket(boid.position) ?? []) {
      if (current === boid) continue;

      const distance = current.position.getDistanceTo(boid.position);

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

    forces.alignment
      .divide(inProximity.length)
      .normalize()
      .multiply(MAX_ALIGN_FORCE);

    forces.separation
      .divide(-inProximity.length)
      .normalize()
      .multiply(MAX_AVOID_FORCE);

    forces.cohesion
      .divide(inProximity.length)
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

      const multiplier =
        MAX_AVOID_FORCE * dynamicAvoidanceForceMultiplier < 0.9
          ? 0.9
          : dynamicAvoidanceForceMultiplier;

      forces.avoidance.normalize().multiply(multiplier);
    }

    if (types.includes("edge-avoidance")) {
      forces["edge-avoidance"] = getEdgeAvoidanceForce(boid, viewportSize);
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
        <BoidRenderer
          key={i}
          boid={boid}
          selected={selectedBoids.includes(boid)}
        />
      ))}

      <gridHelper
        rotation-x={Math.PI / 2}
        position-y={-(viewportWidth - viewportHeight) / 2}
        args={[viewportWidth, viewportWidth / cellSize, 0xff0000, "teal"]}
      />
    </>
  );
}
