import { type GridItemHTMLElement } from 'gridstack';
import React, { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

import { useGridstackContext } from './use-gridstack-context';

export interface GridstackItemProps extends PropsWithChildren {
  id: string;
}

export type ItemRefType = React.MutableRefObject<GridItemHTMLElement | null>;

export const GridstackItem = ({ id, children }: GridstackItemProps) => {
  const { getWidgetContent } = useGridstackContext();
  const widgetContent = getWidgetContent(id);

  if (!widgetContent) {
    return null;
  }

  return createPortal(children, widgetContent);
};
