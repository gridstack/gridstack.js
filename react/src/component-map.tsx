import { ComponentProps } from "react";
import { ComplexCard } from "./components/complex-card";

export const COMPONENT_MAP = {
  Text: (props: { content: string }) => <div>{props.content}</div>,
  Button: (props: { label: string }) => <button>{props.label}</button>,
  ComplexCard,
  // ... more components here
};

export type ComponentMapName = keyof typeof COMPONENT_MAP;
export type ComponentMapProps = {
  [K in ComponentMapName]: ComponentProps<(typeof COMPONENT_MAP)[K]>;
};
export type ComponentInfo = {
  [K in ComponentMapName]: {
    component: K;
    serializableProps: ComponentMapProps[K];
  };
}[ComponentMapName];
