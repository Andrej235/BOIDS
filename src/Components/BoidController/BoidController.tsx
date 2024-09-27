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
  const [a, setA] = useState<Vector2 | undefined>(new Vector2(0, 0));

  return (
    <div className="boid-controller">
      <Canvas color="#000">
        <InnerBoidController
          initialBoids={initialBoids}
          obstacles={obstacles}
          testSteering={a}
        />

        {obstacles.map((obstacle, i) => (
          <ObstacleRenderer key={i} obstacle={obstacle} />
        ))}

        <mesh
          position={[-1, 3, 0]}
          scale={[0.3, 0.3, 0.3]}
          onClick={() =>
            void setA(a?.y ? new Vector2(1, 0) : new Vector2(0, 0.7))
          }
        >
          <sphereGeometry />
          <meshBasicMaterial color={"#fff"} />
        </mesh>

        <mesh
          position={[1, 3, 0]}
          scale={[0.3, 0.3, 0.3]}
          onClick={() => void setA(undefined)}
        >
          <sphereGeometry />
          <meshBasicMaterial color={"#fff"} />
        </mesh>

        <axesHelper scale={50} />
      </Canvas>
    </div>
  );
}

function InnerBoidController({
  initialBoids,
  obstacles,
  testSteering,
}: BoidControllerProps) {
  const [boids, setBoids] = useState<Boid[]>([]);
  useEffect(() => void setBoids(initialBoids), [initialBoids]);
  const {
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree();

  const viewportScale = new Vector2(viewportWidth, viewportHeight);

  const MAX_STEERING_FORCE = 0.003;
  const MAX_SPEED = 0.05;
  const MAX_SEE_AHEAD = 6;
  const MAX_AVOID_FORCE = 0.5;

  useFrame(() => {
    setBoids((boids) => {
      boids.forEach((boid) => {
        const velocity = boid.velocity;

        const steering = getAvoidanceForce(boid) ?? new Vector2(0, 0);
        steering.truncate(MAX_STEERING_FORCE);

        velocity.add(steering).normalize().truncate(MAX_SPEED); //Normalizing guarantees a velocity of a same magnitude regardless of direction and steering direction
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

    const mostThreatening =
      obstacles[0].position.getDistanceTo(ahead) < obstacles[0].radius ||
      obstacles[0].position.getDistanceTo(ahead2) < obstacles[0].radius
        ? obstacles[0]
        : null; //TODO: find most threatening obstacle

    let avoidance: Vector2 | null = null;

    if (mostThreatening) {
      console.log(mostThreatening);

      avoidance = new Vector2(
        ahead.x - mostThreatening.position.x,
        ahead.y - mostThreatening.position.y
      );

      avoidance.normalize().multiply(MAX_AVOID_FORCE);
      // console.log(boid.position, avoidance);
    }

    return avoidance;
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
