import { useMemo } from "react";
import "./App.scss";
import Boid from "./ClassDefinitions/Boid";
import Vector2 from "./ClassDefinitions/Vector2";
import BoidController from "./Components/BoidController/BoidController";

function App() {
  const boids = useMemo(() => {
    const boids: Boid[] = [];

    for (let i: number = 0; i < 750; i++) {
      boids.push(
        new Boid(
          new Vector2(Math.random() * 25, Math.random() * 15),
          new Vector2(Math.random() - 0.5, Math.random() - 0.5)
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
