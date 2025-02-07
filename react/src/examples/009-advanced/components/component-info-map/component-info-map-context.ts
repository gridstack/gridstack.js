import { createContext } from "react";
import { ComponentInfo } from "../../component-map";

export const ComponentInfoMapContext = createContext<{
  componentInfoMap: Map<string, ComponentInfo>;
  setComponentInfoMap: (componentInfoMap: Map<string, ComponentInfo>) => void;
  removeComponentInfo: (widgetId: string) => void;
  addComponentInfo: (widgetId: string, componentInfo: ComponentInfo) => void;
  updateComponentInfo: (widgetId: string, componentInfo: ComponentInfo) => void;
}>({
  componentInfoMap: new Map(),
  setComponentInfoMap: () => {},
  removeComponentInfo: () => {},
  addComponentInfo: () => {},
  updateComponentInfo: () => {},
});
