// gridstack-dragdrop-plugin.ts 2.0.0-rc @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStack } from './gridstack';
import { GridStackElement } from './types';

/** drag&drop options currently called from the main code, but others can be passed in grid options */
export type DDOpts = 'enable' | 'disable' | 'option' | {} | any;
export type DDKey = 'minWidth' | 'minHeight' | string;

/**
 * Base class for drag'n'drop plugin.
 */
export class GridStackDragDropPlugin {
  protected grid: GridStack;
  static registeredPlugins = [];
  
  static registerPlugin(pluginClass) {
    GridStackDragDropPlugin.registeredPlugins.push(pluginClass);
  }

  public constructor(grid: GridStack) {
    this.grid = grid;
  }

  public resizable(el: GridStackElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public draggable(el: GridStackElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public droppable(el: GridStackElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public isDroppable(el: GridStackElement): boolean {
    return false;
  }

  public on(el: GridStackElement, eventName: string, callback): GridStackDragDropPlugin {
    return this;
  }
}
