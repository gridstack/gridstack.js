// gridstack-ddi.ts 3.3.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/
/* eslint-disable @typescript-eslint/no-unused-vars */

import { GridItemHTMLElement } from './types';

/**
 * Abstract Partial Interface API for drag'n'drop plugin - look at GridStackDD and HTML5 / Jquery implementation versions
 */
export class GridStackDDI {

  protected static ddi: GridStackDDI;

  /** call this method to register your plugin instead of the default no-op one */
  static registerPlugin(pluginClass: typeof GridStackDDI): GridStackDDI {
    GridStackDDI.ddi = new pluginClass();
    return GridStackDDI.ddi;
  }

  /** get the current registered plugin to use */
  static get(): GridStackDDI {
    return GridStackDDI.ddi || GridStackDDI.registerPlugin(GridStackDDI);
  }

  /** removes any drag&drop present (called during destroy) */
  public remove(el: GridItemHTMLElement): GridStackDDI {
    return this; // no-op for static grids
  }
}
