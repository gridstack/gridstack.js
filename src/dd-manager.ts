/**
 * dd-manager.ts 6.0.0-beta
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDDroppable } from './dd-droppable';

/**
 * globals that are shared across Drag & Drop instances
 */
export class DDManager {
  /** true if a mouse down event was handled */
  public static mouseHandled: boolean;

  /** item being dragged */
  public static dragElement: DDDraggable;

  /** item we are currently over as drop target */
  public static dropElement: DDDroppable;
}
