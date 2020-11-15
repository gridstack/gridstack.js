// gridstack-dd-native.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDManager } from './dd-manager';
import { DDElement } from './dd-element';

import { GridStack, GridStackElement } from '../gridstack';
import { GridStackDD, DDOpts, DDKey, DDDropOpt, DDCallback, DDValue } from '../gridstack-dd';
import { GridItemHTMLElement, DDDragInOpt } from '../types';

/**
 * HTML 5 Native DragDrop based drag'n'drop plugin.
 */
export class GridStackDDNative extends GridStackDD {
  public constructor(grid: GridStack) {
    super(grid);
  }

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDDNative {
    let dEl = this.getGridStackDDElement(el);
    if (opts === 'disable' || opts === 'enable') {
      dEl.ddResizable[opts]();
    } else if (opts === 'destroy') {
      if (dEl.ddResizable) {
        dEl.cleanResizable();
      }
    } else if (opts === 'option') {
      dEl.setupResizable({ [key]: value });
    } else {
      let handles = dEl.el.getAttribute('gs-resize-handles') ? dEl.el.getAttribute('gs-resize-handles') : this.grid.opts.resizable.handles;
      dEl.setupResizable({
        ...this.grid.opts.resizable,
        ...{ handles: handles },
        ...{
          start: opts.start,
          stop: opts.stop,
          resize: opts.resize
        }
      });
    }
    return this;
  }

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): GridStackDDNative {
    const dEl = this.getGridStackDDElement(el);
    if (opts === 'disable' || opts === 'enable') {
      dEl.ddDraggable && dEl.ddDraggable[opts]();
    } else if (opts === 'destroy') {
      if (dEl.ddDraggable) { // error to call destroy if not there
        dEl.cleanDraggable();
      }
    } else if (opts === 'option') {
      dEl.setupDraggable({ [key]: value });
    } else {
      dEl.setupDraggable({
        ...this.grid.opts.draggable,
        ...{
          containment: (this.grid.opts._isNested && !this.grid.opts.dragOut)
            ? this.grid.el.parentElement
            : (this.grid.opts.draggable.containment || null),
          start: opts.start,
          stop: opts.stop,
          drag: opts.drag
        }
      });
    }
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragInOpt): GridStackDDNative {
    let dEl = this.getGridStackDDElement(el);
    dEl.setupDraggable(opts);
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): GridStackDDNative {
    let dEl = this.getGridStackDDElement(el);
    if (typeof opts.accept === 'function' && !opts._accept) {
      opts._accept = opts.accept;
      opts.accept = (el) => opts._accept(el);
    }
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
    return this;
  }

  public isDroppable(el: GridItemHTMLElement): boolean {
    const dEl = this.getGridStackDDElement(el);
    return !!(dEl.ddDroppable);
  }

  public isDraggable(el: GridStackElement): boolean {
    const dEl = this.getGridStackDDElement(el);
    return !!(dEl.ddDraggable);
  }

  public on(el: GridItemHTMLElement, name: string, callback: DDCallback): GridStackDDNative {
    let dEl = this.getGridStackDDElement(el);
    dEl.on(name, (event: Event) => {
      callback(
        event,
        DDManager.dragElement ? DDManager.dragElement.el : event.target as GridItemHTMLElement,
        DDManager.dragElement ? DDManager.dragElement.helper : null)
    });
    return this;
  }

  public off(el: GridItemHTMLElement, name: string): GridStackDD {
    let dEl = this.getGridStackDDElement(el);
    dEl.off(name);
    return this;
  }
  private getGridStackDDElement(el: GridStackElement): DDElement {
    let dEl;
    if (typeof el === 'string') {
      dEl =  document.querySelector(el as string);
    } else {
      dEl = el;
    }
    return dEl.ddElement ? dEl.ddElement: DDElement.init(dEl);
  }
}

// finally register ourself
GridStackDD.registerPlugin(GridStackDDNative);
