import { useMemo } from "react";
import "./App.scss";
import Boid from "./ClassDefinitions/Boid";
import Obstacle from "./ClassDefinitions/Obstacle";
import Vector2 from "./ClassDefinitions/Vector2";
import BoidController from "./Components/BoidController/BoidController";

function App() {
  const boids = useMemo(() => {
    const boids: Boid[] = [];

    for (let i: number = 0; i < 50; i++) {
      boids.push(
        new Boid(
          new Vector2(Math.random() * 25, Math.random() * 15),
          new Vector2(Math.random() - 0.5, Math.random() - 0.5)
        )
      );
    }

    return boids;
  }, []);

  /*
[
          new Boid(new Vector2(2, 0), new Vector2(1, 0)),
          new Boid(new Vector2(1, 0.1), new Vector2(0, 1)),
          new Boid(new Vector2(0, 0), new Vector2(-0.1, 0)),
          new Boid(new Vector2(11, 1), new Vector2(-0.1543, 0.657)),
          new Boid(new Vector2(0, 0), new Vector2(0.465, -0.1423)),
          new Boid(new Vector2(0, 0), new Vector2(-0.7, 0.32)),
          new Boid(new Vector2(0, 0), new Vector2(0.23, 0.654)),
          new Boid(new Vector2(0, 0), new Vector2(-1, 0)),
          new Boid(new Vector2(0, 0), new Vector2(-0.654, 0.543)),
          new Boid(new Vector2(0, 0), new Vector2(-0.54, -0.543)),
          new Boid(new Vector2(0, 0), new Vector2(-0.12, -0.654)),
        ]
*/

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
