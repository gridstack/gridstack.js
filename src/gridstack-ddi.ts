/**
 * gridstack-ddi.ts 4.2.6
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

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
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public remove(el: GridItemHTMLElement): GridStackDDI {
    return this; // no-op for static grids
  }
}
