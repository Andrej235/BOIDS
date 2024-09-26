import { useEffect, useMemo, useRef } from "react";
import { Mesh } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import Vector2 from "./ClassDefinitions/Vector2";

export default function Cube() {
  const maxVelocity = useMemo(() => 1, []);
  const maxForce = useMemo(() => 1, []);
  const maxSpeed = useMemo(() => 0.005, []);
  const slowingRadius = useMemo(() => 10, []);

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

  const logicalScale = new Vector2(1, 1);

  const velocity = useRef(new Vector2(0, 0));

  //TODO: Remap everything to [0, 1] and send it as input to a function which determines where the cube will be placed. Remap output of that function according to the viewport
  useFrame(() => {
    if (!cubeRef.current) return;

    const cubePosition = new Vector2(
      cubeRef.current.position.x,
      cubeRef.current.position.y
    )
      .remap(viewportScale, logicalScale)
      .remapToPositive(logicalScale);

    const mousePos = mousePosition.current
      .copy()
      .remap(mousePositionScale, logicalScale);

    const newPosition = getPosition(cubePosition, mousePos)
      .remap(logicalScale, viewportScale)
      .remapToNegative(viewportScale);

    cubeRef.current.position.set(newPosition.x, newPosition.y, 0);
  });

  const CIRCLE_RADIUS = 1;
  const CIRCLE_DISTANCE = 2;
  const ANGLE_CHANGE = 0.2;
  const wanderAngle = useRef(0);

  function setAngle(vector: Vector2, value: number): void {
    const len = vector.getMagnitude();
    vector.x = Math.cos(value) * len;
    vector.y = Math.sin(value) * len;
  }

  function getPosition(position: Vector2, target: Vector2): Vector2 {
    return wander(position);
  }

  //@ts-ignore
  function arrival(position: Vector2, target: Vector2) {
    let desiredVelocity = target.subtract(position);
    const distance = desiredVelocity.getMagnitude();

    // Inside the slowing area
    if (distance < slowingRadius)
      desiredVelocity = desiredVelocity
        .normalize()
        .multiply(maxVelocity)
        .multiply(distance / slowingRadius);
    // Outside the slowing area.
    else desiredVelocity = desiredVelocity.normalize().multiply(maxVelocity);

    let steering = desiredVelocity.subtract(velocity.current);
    steering = steering.truncate(maxForce);

    velocity.current = velocity.current.add(steering).truncate(maxSpeed);
    return position.add(velocity.current);
  }

  //@ts-ignore
  function wander(position: Vector2) {
    const circleCenter = velocity.current
      .copy()
      .normalize()
      .multiply(CIRCLE_DISTANCE);

    const displacement = new Vector2(0, -1).multiply(CIRCLE_RADIUS);

    setAngle(displacement, wanderAngle.current);
    wanderAngle.current += Math.random() * ANGLE_CHANGE - ANGLE_CHANGE * 0.5;

    let steering = circleCenter.add(displacement);
    steering = steering.truncate(maxForce);

    velocity.current = velocity.current.add(steering).truncate(maxSpeed);

    return position.add(velocity.current);
  }

  return (
    <mesh ref={cubeRef} scale={scale}>
      <boxGeometry />
      <meshBasicMaterial color="#fff" />
    </mesh>
  );
}
