import "./BoidController.scss";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import Boid from "../../ClassDefinitions/Boid";
import BoidRenderer from "../Boid/BoidRenderer";
import Vector2 from "../../ClassDefinitions/Vector2";

export default function BoidController() {
  const boids = useMemo<Boid[]>(
    () => [new Boid(new Vector2(0, 0), new Vector2(0.2, 0.86))],
    []
  );

  return (
    <div className="boid-controller">
      <Canvas color="#000">
        {boids.map((boid, i) => (
          <BoidRenderer key={i} boid={boid} />
        ))}
      </Canvas>
    </div>
  );
}
