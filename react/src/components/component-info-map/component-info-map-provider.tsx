import { PropsWithChildren, useState, useCallback } from "react";
import { ComponentInfo } from "../../component-map";
import { ComponentInfoMapContext } from "./component-info-map-context";

export function ComponentInfoMapProvider({
  children,
  initialComponentInfoMap,
}: PropsWithChildren<{
  initialComponentInfoMap: Record<string, ComponentInfo>;
}>) {
  const [componentInfoMap, setComponentInfoMap] = useState<
    Map<string, ComponentInfo>
  >(new Map(Object.entries(initialComponentInfoMap)));

  const removeComponentInfo = useCallback((widgetId: string) => {
    setComponentInfoMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(widgetId);
      return newMap;
    });
  }, []);

  const addComponentInfo = useCallback(
    (widgetId: string, componentInfo: ComponentInfo) => {
      setComponentInfoMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(widgetId, componentInfo);
        return newMap;
      });
    },
    []
  );

  const updateComponentInfo = useCallback(
    (widgetId: string, componentInfo: ComponentInfo) => {
      setComponentInfoMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(widgetId, componentInfo);
        return newMap;
      });
    },
    []
  );

  return (
    <ComponentInfoMapContext.Provider
      value={{
        componentInfoMap,
        setComponentInfoMap,
        removeComponentInfo,
        addComponentInfo,
        updateComponentInfo,
      }}
    >
      {children}
    </ComponentInfoMapContext.Provider>
  );
}
