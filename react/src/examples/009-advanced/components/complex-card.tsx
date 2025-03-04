import { PropsWithChildren, useState } from "react";
import {
  GridStackHandleReInitializer,
  useGridStackContext,
  useGridStackItemContext,
} from "../../../lib";
import { newId } from "../../../utils";
import { CUSTOM_DRAGGABLE_HANDLE_CLASSNAME } from "../../../default-grid-options";
import { useComponentInfoMap } from "./component-info-map";

type ComplexCardProps = {
  title: string;
  color?: string;
};

export function ComplexCard(props: ComplexCardProps) {
  return (
    <div style={{ color: props.color }}>
      <h1>{props.title}</h1>
    </div>
  );
}

export function ComplexCardEditableWrapper(
  props: PropsWithChildren<{ serializableProps: ComplexCardProps }>
) {
  const {
    id,
    remove,
    getBounds,
    setSize: setSizeGridStack,
  } = useGridStackItemContext();
  const { addWidget } = useGridStackContext();
  const { addComponentInfo, updateComponentInfo } = useComponentInfoMap();

  const [dialogEditOpen, setDialogEditOpen] = useState(false);

  const title = props.serializableProps.title;
  const color = props.serializableProps.color;
  const setTitle = (title: string) => {
    updateComponentInfo(id, {
      component: "ComplexCard",
      serializableProps: { title, color },
    });
  };
  const setColor = (color: string) => {
    updateComponentInfo(id, {
      component: "ComplexCard",
      serializableProps: { title, color },
    });
  };
  const [size, _setSize] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });
  const setSize = (size: { w: number; h: number }) => {
    _setSize(size);
    setSizeGridStack(size);
  };

  return (
    <>
      {props.children}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <button
          onClick={() => {
            const widgetId = newId();

            addWidget({
              id: widgetId,
              ...getBounds()?.current,
            });

            addComponentInfo(widgetId, {
              component: "ComplexCard",
              serializableProps: { ...props.serializableProps },
            });
          }}
        >
          Duplicate
        </button>

        <button
          onClick={() => {
            remove();
          }}
        >
          Remove
        </button>

        <dialog open={dialogEditOpen} onClose={() => setDialogEditOpen(false)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <label>
              Title:
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label>
              Color:
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </select>
            </label>
            <label>
              Size:
              <select
                value={`${size.w}x${size.h}`}
                onChange={(e) => {
                  const [w, h] = e.target.value.split("x").map(Number);
                  setSize({ w, h });
                }}
              >
                <option value="4x4">4x4</option>
                <option value="6x6">6x6</option>
                <option value="8x8">8x8</option>
              </select>
            </label>
            <div style={{ alignSelf: "flex-end" }}>
              <button type="button" onClick={() => setDialogEditOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </dialog>

        <button
          onClick={() => {
            setDialogEditOpen(true);
            const bounds = getBounds();
            setSize({
              w: bounds?.current.w ?? 0,
              h: bounds?.current.h ?? 0,
            });
          }}
        >
          Edit
        </button>

        <GridStackHandleReInitializer>
          <button
            style={{
              cursor: "move",
            }}
            className={CUSTOM_DRAGGABLE_HANDLE_CLASSNAME}
          >
            Move
          </button>
        </GridStackHandleReInitializer>
      </div>
    </>
  );
}
