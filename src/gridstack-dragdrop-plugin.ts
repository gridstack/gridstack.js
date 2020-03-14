// gridstack-dragdrop-plugin.ts 2.0.0-rc @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridStack } from './gridstack';
import { GridItemHTMLElement } from './types';

/** drag&drop options currently called from the main code, but others can be passed in grid options */
export type DDOpts = 'enable' | 'disable' | 'destroy' | 'option' | {} | any;
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

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?): GridStackDragDropPlugin {
    return this;
  }

  public isDroppable(el: GridItemHTMLElement): boolean {
    return false;
  }

  public on(el: GridItemHTMLElement, eventName: string, callback): GridStackDragDropPlugin {
    return this;
  }
}
