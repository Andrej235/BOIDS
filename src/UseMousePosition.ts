import { useEffect, useState } from "react";
import Vector2 from "./ClassDefinitions/Vector2";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<Vector2>(
    new Vector2(0, 0)
  );

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition(
        new Vector2(ev.clientX, window.innerHeight - ev.clientY)
      );
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () =>
      void window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};
export default useMousePosition;
