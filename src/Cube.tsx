import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector2 } from "./Vector2";

export default function Cube() {
  const maxVelocity = useMemo(() => 1, []);

  const cubeRef = useRef<Mesh>(null);

  const mousePosition = useRef<Vector2>(new Vector2(0, 0));

  const updateMousePosition = (ev: MouseEvent) => {
    mousePosition.current = new Vector2(
      ev.clientX,
      window.innerHeight - ev.clientY
    );
  };

  useEffect(() => {
    window.addEventListener("mousemove", updateMousePosition);
    return () =>
      void window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const viewport = useThree((state) => state.viewport);
  const scale = Math.min(viewport.width, viewport.height) / 10;
  const viewportScale = new Vector2(viewport.width, viewport.height);

  const mousePositionScale = new Vector2(window.innerWidth, window.innerHeight);

  //TODO: Remap everything to [0, 1] and send it as input to a function which determines where the cube will be placed. Remap output of that function according to the viewport
  useFrame(() => {
    if (!cubeRef.current) return;

    // const cubePosition = new Vector2(
    //   cubeRef.current.position.x,
    //   cubeRef.current.position.y
    // );

    const mousePos = mousePosition.current.copy();

    const remappedMousePos = mousePos
      .remap(mousePositionScale, viewportScale)
      .remapToNegative(viewportScale);

    cubeRef.current.position.set(remappedMousePos.x, remappedMousePos.y, 0);
  });

  return (
    <mesh ref={cubeRef} scale={scale}>
      <boxGeometry />
      <meshBasicMaterial color="#fff" />
    </mesh>
  );
}
