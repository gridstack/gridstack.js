// gridstack-dd.ts 2.0.0 @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GridStack, GridStackElement } from './gridstack';
import { GridItemHTMLElement, DDDragInOpt } from './types';

/** Drag&Drop drop options */
export type DDDropOpt = {
  /** function or class type that this grid will accept as dropped items (see GridstackOptions.acceptWidgets) */
  accept?: (el: GridItemHTMLElement) => boolean;
}

/** drag&drop options currently called from the main code, but others can be passed in grid options */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DDOpts = 'enable' | 'disable' | 'destroy' | 'option' | string | {} | any;
export type DDKey = 'minWidth' | 'minHeight' | string;
export type DDValue = number | string;

/** drag&drop events callbacks */
export type DDCallback = (event: Event, arg2: GridItemHTMLElement, helper?: GridItemHTMLElement) => void;

/**
 * Base class for drag'n'drop plugin.
 */
export class GridStackDD {
  protected grid: GridStack;
  static registeredPlugins: typeof GridStackDD[] = [];

  /** call this method to register your plugin instead of the default no-op one */
  static registerPlugin(pluginClass: typeof GridStackDD) {
    GridStackDD.registeredPlugins.push(pluginClass);
  }

  /** get the current registered plugin to use */
  static get(): typeof GridStackDD {
    return GridStackDD.registeredPlugins[0] || GridStackDD;
  }

  public constructor(grid: GridStack) {
    this.grid = grid;
  }

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD {
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDD {
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragInOpt): GridStackDD {
    return this;
  }

  public isDraggable(el: GridStackElement): boolean {
    return false;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): GridStackDD {
    return this;
  }

  public isDroppable(el: GridItemHTMLElement): boolean {
    return false;
  }

  public on(el: GridItemHTMLElement, eventName: string, callback: DDCallback): GridStackDD {
    return this;
  }

  public off(el: GridItemHTMLElement, eventName: string): GridStackDD {
    return this;
  }
}
