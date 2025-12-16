import { useRef, memo } from "react";
import { createPortal } from "react-dom";
import { useGridStackContext } from "./grid-stack-context";
import { useGridStackRenderContext } from "./grid-stack-render-context";
import { GridStackWidgetContext } from "./grid-stack-widget-context";
import { GridStackWidget } from "gridstack";
import { ComponentType } from "react";

export interface ComponentDataType<T = object> {
  name: string;
  props: T;
}

type ParsedComponentData = ComponentDataType & {
  error: unknown;
  metaHash: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentMap = Record<string, ComponentType<any>>;

function parseWeightMetaToComponentData(
  meta: GridStackWidget,
  cache: Map<string, ParsedComponentData>
): ComponentDataType & { error: unknown } {
  const cacheKey = meta.id ?? "";
  const metaHash = meta.content ?? "";
  const cached = cache.get(cacheKey);
  // Ensure componentData is immutable between renders
  if (cached && cached.metaHash === metaHash) return cached;

  let error = null;
  let name = "";
  let props = {};
  try {
    if (meta.content) {
      const result = JSON.parse(meta.content) as {
        name: string;
        props: object;
      };
      name = result.name;
      props = result.props;
    }
  } catch (e) {
    error = e;
  }
  const parsed: ParsedComponentData = {
    name,
    props,
    error,
    metaHash,
  };
  cache.set(cacheKey, parsed);
  return parsed;
}

type WidgetMemoProps = {
  id: string;
  componentData: ComponentDataType;
  widgetContainer: HTMLElement;
  WidgetComponent: ComponentType<unknown>;
};

const WidgetMemo = memo(
  ({
    id,
    componentData,
    widgetContainer,
    WidgetComponent,
  }: WidgetMemoProps) => {
    return (
      <GridStackWidgetContext.Provider value={{ widget: { id } }}>
        {createPortal(
          <WidgetComponent {...componentData.props} />,
          widgetContainer
        )}
      </GridStackWidgetContext.Provider>
    );
  }
);
WidgetMemo.displayName = "WidgetMemo";

export function GridStackRender(props: { componentMap: ComponentMap }) {
  const { _rawWidgetMetaMap } = useGridStackContext();
  const { getWidgetContainer } = useGridStackRenderContext();
  const parsedCache = useRef<Map<string, ParsedComponentData>>(new Map());

  return (
    <>
      {Array.from(_rawWidgetMetaMap.value.entries()).map(([id, meta]) => {
        const componentData = parseWeightMetaToComponentData(
          meta,
          parsedCache.current
        );

        const WidgetComponent = props.componentMap[componentData.name];

        const widgetContainer = getWidgetContainer(id);

        if (!widgetContainer) {
          return null;
        }

        return (
          <WidgetMemo
            id={id}
            key={id}
            componentData={componentData}
            widgetContainer={widgetContainer}
            WidgetComponent={WidgetComponent}
          />
        );
      })}
    </>
  );
}
