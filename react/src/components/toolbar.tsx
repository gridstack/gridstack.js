import { BREAKPOINTS, CELL_HEIGHT } from "../default-grid-options";
import { useGridStackContext } from "../lib";
import { newId } from "../utils";
import { useComponentInfoMap } from "./component-info-map";

export function Toolbar() {
  const { addWidget } = useGridStackContext();
  const { addComponentInfo } = useComponentInfoMap();

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        flexDirection: "row",
        gap: "10px",
      }}
    >
      <button
        onClick={() => {
          const widgetId = newId();
          addWidget({
            id: widgetId,
            w: 2,
            h: 2,
            x: 0,
            y: 0,
          });
          addComponentInfo(widgetId, {
            component: "Text",
            serializableProps: { content: "Text " + widgetId },
          });
        }}
      >
        Add Text (2x2)
      </button>

      <button
        onClick={() => {
          addWidget({
            id: newId(),
            h: 5,
            noResize: false,
            sizeToContent: true,
            subGridOpts: {
              acceptWidgets: true,
              columnOpts: { breakpoints: BREAKPOINTS, layout: "moveScale" },
              margin: 8,
              minRow: 2,
              cellHeight: CELL_HEIGHT,
              children: [
                {
                  id: newId(),
                  h: 1,
                  locked: true,
                  noMove: true,
                  noResize: true,
                  w: 12,
                  x: 0,
                  y: 0,
                },
              ],
            },
            w: 12,
            x: 0,
            y: 0,
          });
        }}
      >
        Add Sub Grid (12x1)
      </button>
    </div>
  );
}
