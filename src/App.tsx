import { useMemo } from "react";
import "./App.scss";
import Boid from "./ClassDefinitions/Boid";
import Vector3 from "./ClassDefinitions/Vector3";
import BoidController from "./Components/BoidController/BoidController";

function App() {
  const boids = useMemo(() => {
    const boids: Boid[] = [];

    for (let i: number = 0; i < 100; i++) {
      boids.push(
        new Boid(
          i,
          new Vector3(
            Math.random() * 25,
            Math.random() * 15,
            Math.random() * 25
          ),
          new Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          )
        )
      );
    }

    return boids;
  }, []);

  return (
    <div className="page-container">
      <BoidController
        initialBoids={boids}
        obstacles={
          [
            // new Obstacle(new Vector2(0, 0.5), 1),
            // new Obstacle(new Vector2(-1, 0.1), 1.3),
            // new Obstacle(new Vector2(-1, -1), 1.3),
            // new Obstacle(new Vector2(3, -1.5), 1.2),
          ]
        }
      />
    </div>
  );
}

export default App;
