import "./BoidController.scss";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import Boid from "../../ClassDefinitions/Boid";
import BoidRenderer from "../Boid/BoidRenderer";

type BoidControllerProps = {
  initialBoids: Boid[];
};

export default function BoidController({ initialBoids }: BoidControllerProps) {
  return (
    <div className="boid-controller">
      <Canvas color="#000">
        <InnerBoidController initialBoids={initialBoids} />
      </Canvas>
    </div>
  );
}

function InnerBoidController({ initialBoids }: BoidControllerProps) {
  const [boids, setBoids] = useState<Boid[]>([]);
  useEffect(() => void setBoids(initialBoids), [initialBoids]);

  useFrame(() => {
    setBoids((boids) => {
      boids.forEach((boid) => {
        const velocity = boid.forward.copy();
        velocity.truncate(0.01);

        boid.position.add(velocity);
        console.log(boid.position);
      });

      return boids.slice();
    });
  });

  return (
    <>
      {boids.map((boid, i) => (
        <BoidRenderer key={i} boid={boid} />
      ))}
    </>
  );
}
