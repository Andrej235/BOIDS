import { Canvas } from "@react-three/fiber";
import "./App.scss";
import Cube from "./Cube";

function App() {
  return (
    <div className="page-container">
      <Canvas color="#000">
        <Cube />
      </Canvas>
    </div>
  );
}

export default App;
