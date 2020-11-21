// gridstack-dd-native.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDManager } from './dd-manager';
import { DDElement, DDElementHost } from './dd-element';

import { GridStackElement } from '../gridstack';
import { GridStackDD, DDOpts, DDKey, DDDropOpt, DDCallback, DDValue } from '../gridstack-dd';
import { GridItemHTMLElement, DDDragInOpt } from '../types';
import { Utils } from '../utils';

/**
 * HTML 5 Native DragDrop based drag'n'drop plugin.
 */
export class GridStackDDNative extends GridStackDD {

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDDNative {
    this.getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddResizable[opts]();
      } else if (opts === 'destroy') {
        if (dEl.ddResizable) {
          dEl.cleanResizable();
        }
      } else if (opts === 'option') {
        dEl.setupResizable({ [key]: value });
      } else {
        const grid = dEl.el.gridstackNode.grid;
        let handles = dEl.el.getAttribute('gs-resize-handles') ? dEl.el.getAttribute('gs-resize-handles') : grid.opts.resizable.handles;
        dEl.setupResizable({
          ...grid.opts.resizable,
          ...{ handles: handles },
          ...{
            start: opts.start,
            stop: opts.stop,
            resize: opts.resize
          }
        });
      }
    });
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDDNative {
    this.getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddDraggable && dEl.ddDraggable[opts]();
      } else if (opts === 'destroy') {
        if (dEl.ddDraggable) { // error to call destroy if not there
          dEl.cleanDraggable();
        }
      } else if (opts === 'option') {
        dEl.setupDraggable({ [key]: value });
      } else {
        const grid = dEl.el.gridstackNode.grid;
        dEl.setupDraggable({
          ...grid.opts.draggable,
          ...{
            containment: (grid.opts._isNested && !grid.opts.dragOut)
              ? grid.el.parentElement
              : (grid.opts.draggable.containment || null),
            start: opts.start,
            stop: opts.stop,
            drag: opts.drag
          }
        });
      }
    });
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragInOpt): GridStackDDNative {
    this.getDDElements(el).forEach(dEl => dEl.setupDraggable(opts));
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): GridStackDDNative {
    if (typeof opts.accept === 'function' && !opts._accept) {
      opts._accept = opts.accept;
      opts.accept = (el) => opts._accept(el);
    }
    this.getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddDroppable && dEl.ddDroppable[opts]();
      } else if (opts === 'destroy') {
        if (dEl.ddDroppable) { // error to call destroy if not there
          dEl.cleanDroppable();
        }
      } else if (opts === 'option') {
        dEl.setupDroppable({ [key]: value });
      } else {
        dEl.setupDroppable(opts);
      }
    });
    return this;
  }

  /** true if at least one of them is droppable */
  public isDroppable(el: GridItemHTMLElement): boolean {
    return this.getDDElements(el).some(dEl => !!(dEl.ddDroppable));
  }

  /** true if at least one of them is draggable */
  public isDraggable(el: GridStackElement): boolean {
    return this.getDDElements(el).some(dEl => !!(dEl.ddDraggable));
  }

  public on(el: GridItemHTMLElement, name: string, callback: DDCallback): GridStackDDNative {
    this.getDDElements(el).forEach(dEl =>
      dEl.on(name, (event: Event) => {
        callback(
          event,
          DDManager.dragElement ? DDManager.dragElement.el : event.target as GridItemHTMLElement,
          DDManager.dragElement ? DDManager.dragElement.helper : null)
      })
    );
    return this;
  }

  public off(el: GridItemHTMLElement, name: string): GridStackDD {
    this.getDDElements(el).forEach(dEl => dEl.off(name));
    return this;
  }

  private getDDElements(els: GridStackElement): DDElement[] {
    let list = Utils.getElements(els) as DDElementHost[];
    if (!list.length) { return []; }
    return list.map(e => e.ddElement || DDElement.init(e));
  }
}

// finally register ourself
GridStackDD.registerPlugin(GridStackDDNative);
