import { useEffect, useState } from "react";
import Vector3 from "./ClassDefinitions/Vector3";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<Vector3>(
    new Vector3(0, 0)
  );

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition(
        new Vector3(ev.clientX, window.innerHeight - ev.clientY)
      );
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () =>
      void window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};
export default useMousePosition;
