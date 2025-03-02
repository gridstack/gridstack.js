import { GridStack, GridStackWidget } from "gridstack";

export const widgetContainers = new Array<{
  element: HTMLElement;
  initWidget: GridStackWidget;
}>();

GridStack.renderCB = (element: HTMLElement, widget: GridStackWidget) => {
  widgetContainers.push({ element, initWidget: widget });
};
