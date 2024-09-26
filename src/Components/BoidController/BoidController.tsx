import "./BoidController.scss";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
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
  const {
    viewport: { width: viewportWidth, height: viewportHeight },
  } = useThree();

  useFrame(() => {
    setBoids((boids) => {
      boids.forEach((boid) => {
        const velocity = boid.forward.copy();
        velocity.truncate(0.05); //Limit the maximum velocity //TODO: pull this out to a constant or a prop

        boid.position.add(velocity);

        if (boid.position.x < -viewportWidth / 2)
          boid.position.x = viewportWidth / 2;
        else if (boid.position.x > viewportWidth / 2)
          boid.position.x = -viewportWidth / 2;

        if (boid.position.y < -viewportHeight / 2)
          boid.position.y = viewportHeight / 2;
        else if (boid.position.y > viewportHeight / 2)
          boid.position.y = -viewportHeight / 2;

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
