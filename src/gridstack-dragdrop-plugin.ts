// gridstack-dragdrop-plugin.ts 2.0.0-rc @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GridStack } from './gridstack';
import { GridItemHTMLElement } from './types';

/** Drag&Drop drop options */
export type DDDropOpt = {
  /** function or class type that this grid will accept as dropped items (see GridstackOptions.acceptWidgets) */
  accept?: (el: GridItemHTMLElement) => boolean;
}

/** drag&drop options currently called from the main code, but others can be passed in grid options */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DDOpts = 'enable' | 'disable' | 'destroy' | 'option' | string | {} | any;
export type DDKey = 'minWidth' | 'minHeight' | string;

/** drag&drop events callbacks */
export type DDCallback = (event: Event, arg2: GridItemHTMLElement) => void;

/**
 * Base class for drag'n'drop plugin.
 */
export class GridStackDragDropPlugin {
  protected grid: GridStack;
  static registeredPlugins: typeof GridStackDragDropPlugin[] = [];

  static registerPlugin(pluginClass: typeof GridStackDragDropPlugin) {
    GridStackDragDropPlugin.registeredPlugins.push(pluginClass);
  }

  public constructor(grid: GridStack) {
    this.grid = grid;
  }

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public isDroppable(el: GridItemHTMLElement): boolean {
    return false;
  }

  public on(el: GridItemHTMLElement, eventName: string, callback: DDCallback): GridStackDragDropPlugin {
    return this;
  }

  public off(el: GridItemHTMLElement, eventName: string): GridStackDragDropPlugin {
    return this;
  }
}
