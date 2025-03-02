import { GridStackOptions } from "gridstack";
import { PropsWithChildren } from "react";
import { GridStackProvider } from "./grid-stack-provider";
import { GridStackRender } from "./grid-stack-render";

export type GridStackContainerProps = PropsWithChildren<{
  initialOptions: GridStackOptions;
}>;

export function GridStackContainer({
  children,
  initialOptions,
}: GridStackContainerProps) {
  return (
    <GridStackProvider initialOptions={initialOptions}>
      <GridStackRender>{children}</GridStackRender>
    </GridStackProvider>
  );
}
