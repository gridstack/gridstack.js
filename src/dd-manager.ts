/**
 * dd-manager.ts 10.0.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDDroppable } from './dd-droppable';
import { DDResizable } from './dd-resizable';

/**
 * globals that are shared across Drag & Drop instances
 */
export class DDManager {
  /** if set (true | in msec), dragging placement (collision) will only happen after a pause by the user*/
  public static pauseDrag: boolean | number;

  /** true if a mouse down event was handled */
  public static mouseHandled: boolean;

  /** item being dragged */
  public static dragElement: DDDraggable;

  /** item we are currently over as drop target */
  public static dropElement: DDDroppable;

  /** current item we're over for resizing purpose (ignore nested grid resize handles) */
  public static overResizeElement: DDResizable;

}
