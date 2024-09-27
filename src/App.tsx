import "./App.scss";
import Boid from "./ClassDefinitions/Boid";
import Obstacle from "./ClassDefinitions/Obstacle";
import Vector2 from "./ClassDefinitions/Vector2";
import BoidController from "./Components/BoidController/BoidController";

function App() {
  return (
    <div className="page-container">
      <BoidController
        initialBoids={[
          new Boid(new Vector2(2, 0), new Vector2(1, 0)),
          // new Boid(new Vector2(0, 0), new Vector2(-0.1, 0)),
          // new Boid(new Vector2(11, 1), new Vector2(-0.1543, 0.657)),
          // new Boid(new Vector2(0, 0), new Vector2(0.465, -0.1423)),
          // new Boid(new Vector2(0, 0), new Vector2(-0.7, 0.32)),
          // new Boid(new Vector2(0, 0), new Vector2(0.23, 0.654)),
          // new Boid(new Vector2(0, 0), new Vector2(-1, 0)),
          // new Boid(new Vector2(0, 0), new Vector2(-0.654, 0.543)),
          // new Boid(new Vector2(0, 0), new Vector2(-0.54, -0.543)),
          // new Boid(new Vector2(0, 0), new Vector2(-0.12, -0.654)),
        ]}
        obstacles={[
          new Obstacle(new Vector2(0, 0.5), 1),
          // new Obstacle(new Vector2(3, -1.5), 0.5),
          // new Obstacle(new Vector2(-1, 0), 1.3),
        ]}
      />
    </div>
  );
}

export default App;
