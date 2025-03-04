import { PropsWithChildren, useCallback } from "react";
import { useGridStackRenderContext } from "./grid-stack-render-context";
import { createPortal } from "react-dom";
import { GridStackItemContext } from "./grid-stack-item-context";
import { useGridStackContext } from "./grid-stack-context";
import { GridItemHTMLElement, GridStackWidget } from "gridstack";

export type GridStackItemProps = PropsWithChildren<{
  id: string;
}>;

export function GridStackItem(props: GridStackItemProps) {
  const renderContext = useGridStackRenderContext();
  const widgetContainer = renderContext.getContainerByWidgetId(props.id);

  const { removeWidget, _gridStack } = useGridStackContext();

  const remove = useCallback(() => {
    if (widgetContainer?.parentElement) {
      removeWidget(widgetContainer.parentElement as GridItemHTMLElement);
    }
  }, [removeWidget, widgetContainer?.parentElement]);

  const update = useCallback(
    (opt: GridStackWidget) => {
      if (widgetContainer?.parentElement) {
        _gridStack.value?.update(widgetContainer.parentElement, opt);
      }
    },
    [_gridStack.value, widgetContainer?.parentElement]
  );

  const getBounds = useCallback(() => {
    const parentNode = widgetContainer?.parentElement;
    if (parentNode) {
      const widgetNode = parentNode as GridItemHTMLElement;
      if (widgetNode.gridstackNode) {
        const gridstackNode = widgetNode.gridstackNode;
        return {
          current: {
            x: gridstackNode.x,
            y: gridstackNode.y,
            w: gridstackNode.w,
            h: gridstackNode.h,
          },
          original: {
            x: gridstackNode.x,
            y: gridstackNode.y,
            w: gridstackNode.w,
            h: gridstackNode.h,
          },
        };
      }
    }
    return null;
  }, [widgetContainer?.parentElement]);

  const setSize = useCallback(
    (size: { w: number; h: number }) => {
      if (widgetContainer?.parentElement) {
        _gridStack.value?.update(widgetContainer.parentElement, {
          w: size.w,
          h: size.h,
        });
      }
    },
    [_gridStack.value, widgetContainer?.parentElement]
  );
  const setPosition = useCallback(
    (position: { x: number; y: number }) => {
      if (widgetContainer?.parentElement) {
        _gridStack.value?.update(widgetContainer.parentElement, {
          x: position.x,
          y: position.y,
        });
      }
    },
    [_gridStack.value, widgetContainer?.parentElement]
  );

  if (!widgetContainer) {
    return null;
  }

  return createPortal(
    <GridStackItemContext.Provider
      value={{
        id: props.id,
        remove,
        update,
        getBounds,
        setSize,
        setPosition,
      }}
    >
      {props.children}
    </GridStackItemContext.Provider>,
    widgetContainer
  );
}
