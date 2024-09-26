import "./App.scss";
import Boid from "./ClassDefinitions/Boid";
import Vector2 from "./ClassDefinitions/Vector2";
import BoidController from "./Components/BoidController/BoidController";

function App() {
  return (
    <div className="page-container">
      <BoidController
        initialBoids={[
          new Boid(new Vector2(0, 0), new Vector2(0.2, 0.2)),
          new Boid(new Vector2(0, 0), new Vector2(0, 0.987)),
          new Boid(new Vector2(0, 0), new Vector2(0.465, -0.1423)),
          new Boid(new Vector2(0, 0), new Vector2(-0.7, 0.32)),
          new Boid(new Vector2(0, 0), new Vector2(0.23, 0.654)),
          new Boid(new Vector2(0, 0), new Vector2(-1, 0)),
          new Boid(new Vector2(0, 0), new Vector2(-0.654, 0.543)),
          new Boid(new Vector2(0, 0), new Vector2(-0.54, -0.543)),
          new Boid(new Vector2(0, 0), new Vector2(-0.12, -0.654)),
        ]}
      />
    </div>
  );
}

export default App;
