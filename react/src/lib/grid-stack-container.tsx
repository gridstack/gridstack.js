import { GridStackOptions } from "gridstack";
import { PropsWithChildren } from "react";
import { GridStackProvider } from "./grid-stack-provider";
import { GridStackRender } from "./grid-stack-render";

export type GridStackContainerProps = PropsWithChildren<{
  initialOptions: GridStackOptions;
  renderRawContent?: boolean;
}>;

export function GridStackContainer({
  children,
  initialOptions,
  renderRawContent,
}: GridStackContainerProps) {
  return (
    <GridStackProvider initialOptions={initialOptions}>
      <GridStackRender renderRawContent={renderRawContent}>
        {children}
      </GridStackRender>
    </GridStackProvider>
  );
}
