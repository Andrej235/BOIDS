import { useGLTF } from "@react-three/drei";
import Boid from "../../ClassDefinitions/Boid";

type BoidRendererProps = {
  boid: Boid;
};

export default function BoidRenderer({ boid }: BoidRendererProps) {
  const { scene } = useGLTF("/3DModels/boid.glb");

  return (
    <mesh
      rotation={[0, 0, boid.rotation]}
      position={[boid.position.x, boid.position.y, 0]}
      scale={[0.1, 0.1, 0.1]}
      geometry={(scene.children[0] as any).geometry}
    >
      <meshBasicMaterial color={"#fff"} />
    </mesh>
  );
}
