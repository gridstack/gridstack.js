import { DDDragOpt, GridStack, GridStackWidget, Utils } from "gridstack";
import {
  ComponentProps,
  Fragment,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type GridStackDragInItemProps = PropsWithChildren<
  Omit<ComponentProps<"div">, "content" | "children" | "widget"> & {
    widget: Omit<GridStackWidget, "content">;
    dragOptions?: DDDragOpt;
    content?: ReactNode;
  }
>;

/**
 * @experimental
 * This is a temporary solution to drag in items to the grid.
 * Copy the original element and render it in the portal.
 */
export function GridStackDragInItem({
  children,
  widget,
  className,
  dragOptions,
  content,
  ...props
}: GridStackDragInItemProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [clones, setClones] = useState<Map<string, HTMLElement>>(new Map());
  const incrementalId = useRef(0);

  useEffect(() => {
    if (panelRef.current) {
      GridStack.setupDragIn(
        [panelRef.current],
        {
          ...dragOptions,
          helper: (el) => {
            const clone = Utils.cloneNode(el);
            const id = String(incrementalId.current++);

            setClones((prev) => {
              const newMap = new Map(prev);
              newMap.set(id, clone);
              return newMap;
            });
            // ! clear dom copied from the original element
            clone.children[0].innerHTML = "";
            return clone;
          },
        },
        [widget]
      );
    }
  }, [clones, dragOptions, widget]);

  return (
    <>
      <div {...props} ref={panelRef} className={`grid-stack-item ${className}`}>
        <div className="grid-stack-item-content">{children}</div>
      </div>

      {/* Render the cloned element in the portal */}
      {Array.from(clones.entries()).map(([id, clone]) => (
        <Fragment key={id}>
          {createPortal(content ?? children, clone.children[0])}
        </Fragment>
      ))}
    </>
  );
}
