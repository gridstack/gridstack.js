import { useState } from "react";

import {
  GridStackItem,
  GridStackProvider,
  GridStackRender,
  useGridStackContext,
} from "../../lib";
import { GridStackOptions } from "gridstack";
import { defaultGridOptions } from "../../default-grid-options";
import { COMPONENT_MAP, ComponentInfo } from "./component-map";
import { ComplexCardEditableWrapper } from "./components/complex-card";
import {
  ComponentInfoMapProvider,
  useComponentInfoMap,
} from "./components/component-info-map";
import { newId } from "../../utils";

export function Advanced() {
  // Data about layout by gridstack option
  const [uncontrolledInitialOptions] = useState<GridStackOptions>(() => ({
    ...defaultGridOptions,
    children: [
      { id: "item1", h: 2, w: 2, x: 0, y: 0 },
      { id: "item2", h: 2, w: 2, x: 2, y: 0 },
      {
        id: "sub-grid-1",
        h: 5,
        sizeToContent: true,
        subGridOpts: {
          children: [
            {
              id: "sub-grid-1-title",
              locked: true,
              noMove: true,
              noResize: true,
              w: 12,
              x: 0,
              y: 0,
              content: "Sub Grid 1",
            },
            { id: "item3", h: 2, w: 2, x: 0, y: 1 },
            { id: "item4", h: 2, w: 2, x: 2, y: 0 },
          ],
        },
        w: 4,
        x: 0,
        y: 2,
      },
      { id: "item5", w: 4, h: 4, x: 0, y: 2 },
    ],
  }));

  // Data about every content
  const [initialComponentInfoMap] = useState<Record<string, ComponentInfo>>(
    () => ({
      item1: { component: "Text", serializableProps: { content: "Text" } },
      item2: { component: "Text", serializableProps: { content: "Text" } },
      "sub-grid-1-title": {
        component: "Text",
        serializableProps: { content: "Sub Grid 1" },
      },
      item3: { component: "Text", serializableProps: { content: "Text" } },
      item4: {
        component: "Counter",
        serializableProps: { label: "Click me" },
      },
      item5: {
        component: "ComplexCard",
        serializableProps: { title: "Complex Card", color: "red" },
      },
    })
  );

  return (
    <ComponentInfoMapProvider initialComponentInfoMap={initialComponentInfoMap}>
      <GridStackProvider initialOptions={uncontrolledInitialOptions}>
        <Toolbar />

        <GridStackRender>
          <DynamicGridStackItems />
        </GridStackRender>
      </GridStackProvider>
    </ComponentInfoMapProvider>
  );
}

function DynamicGridStackItems() {
  const { componentInfoMap } = useComponentInfoMap();

  return (
    <>
      {Array.from(componentInfoMap.entries()).map(
        ([widgetId, componentInfo]) => {
          const Component = COMPONENT_MAP[componentInfo.component];
          if (!Component) {
            throw new Error(`Component ${componentInfo.component} not found`);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const props = componentInfo.serializableProps as any;

          if (componentInfo.component === "ComplexCard") {
            return (
              <GridStackItem key={widgetId} id={widgetId}>
                <ComplexCardEditableWrapper
                  key={`complex-card-editable-wrapper-${widgetId}`}
                  serializableProps={componentInfo.serializableProps}
                >
                  <Component {...props} key={`component-${widgetId}`} />
                </ComplexCardEditableWrapper>
              </GridStackItem>
            );
          }

          // ... more render conditions here

          return (
            <GridStackItem key={widgetId} id={widgetId}>
              <Component {...props} key={`component-${widgetId}`} />
            </GridStackItem>
          );
        }
      )}
    </>
  );
}

export function Toolbar() {
  const { addWidget } = useGridStackContext();
  const { addComponentInfo } = useComponentInfoMap();

  function handleAddText(w: number, h: number) {
    const widgetId = newId();

    // Add item to layout
    addWidget({ id: widgetId, w, h, x: 0, y: 0 });

    // Add component to item
    addComponentInfo(widgetId, {
      component: "Text",
      serializableProps: { content: "Text " + widgetId },
    });
  }

  function handleAddSubGrid() {
    const subGridId = newId();
    const subGridTitleId = newId();
    const item1Id = newId();
    const item2Id = newId();

    addWidget({
      id: subGridId,
      h: 5,
      sizeToContent: true,
      subGridOpts: {
        children: [
          {
            id: subGridTitleId,
            locked: true,
            noMove: true,
            noResize: true,
            w: 12,
            x: 0,
            y: 0,
          },
          { id: item1Id, h: 2, w: 2, x: 0, y: 1 },
          { id: item2Id, h: 2, w: 2, x: 2, y: 0 },
        ],
      },
      w: 4,
      x: 0,
      y: 0,
    });

    addComponentInfo(subGridTitleId, {
      component: "Text",
      serializableProps: { content: "Sub Grid " + subGridId },
    });

    addComponentInfo(item1Id, {
      component: "Text",
      serializableProps: { content: "Item " + item1Id },
    });

    addComponentInfo(item2Id, {
      component: "Text",
      serializableProps: { content: "Item " + item2Id },
    });
  }

  function handleAddComplexCard() {
    const widgetId = newId();

    addWidget({ id: widgetId, w: 4, h: 4 }); // No position

    addComponentInfo(widgetId, {
      component: "ComplexCard",
      serializableProps: { title: "Complex Card", color: "red" },
    });
  }

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
          handleAddText(2, 2);
        }}
      >
        Add Text (2x2)
      </button>

      <button
        onClick={() => {
          handleAddSubGrid();
        }}
      >
        Add Sub Grid (4x5)
      </button>
      <button
        onClick={() => {
          handleAddComplexCard();
        }}
      >
        Append Complex Card (4x4)
      </button>
    </div>
  );
}
