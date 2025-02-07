import { ComponentProps } from "react";
import { ComplexCard } from "./components/complex-card";
import { Counter } from "./components/counter";
import { Text } from "./components/text";

export const COMPONENT_MAP = {
  Text,
  Counter,
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
