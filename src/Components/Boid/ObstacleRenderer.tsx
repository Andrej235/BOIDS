import Obstacle from "../../ClassDefinitions/Obstacle";

type ObstacleRendererProps = {
  obstacle: Obstacle;
};

export default function ObstacleRenderer({ obstacle }: ObstacleRendererProps) {
  return (
    <mesh
      position={[obstacle.position.x, obstacle.position.y, 0]}
      scale={[
        obstacle.radius / 2.25,
        obstacle.radius / 2.25,
        obstacle.radius / 2.25,
      ]}
    >
      <sphereGeometry />
      <meshBasicMaterial color={"#555"} />
    </mesh>
  );
}
