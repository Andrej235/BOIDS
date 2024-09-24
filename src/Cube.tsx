import { useRef } from "react";
import { Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";

type Vector2 = {
  x: number;
  y: number;
};

export default function Cube() {
  const cubeRef = useRef<Mesh>(null);
  const velocity = useRef<Vector2>({
    x: 0,
    y: 0.01,
  });

  useFrame(() => {
    if (!cubeRef.current) return;

    const position = cubeRef.current.position;

    cubeRef.current.position.set(
      position.x,
      position.y + velocity.current.y,
      0
    );
  });

  const viewport = useThree((state) => state.viewport);
  const scale = Math.min(viewport.width, viewport.height) / 10;

  return (
    <mesh ref={cubeRef} scale={scale}>
      <boxGeometry />
      <meshBasicMaterial color="#fff" />
    </mesh>
  );
}
