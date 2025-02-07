import { useContext } from "react";
import { ComponentInfoMapContext } from "./component-info-map-context";

export function useComponentInfoMap() {
  const context = useContext(ComponentInfoMapContext);
  if (!context) {
    throw new Error(
      "useComponentInfoMap must be used within a ComponentInfoMapProvider"
    );
  }
  return context;
}
