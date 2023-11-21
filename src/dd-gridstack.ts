/**
 * dd-gridstack.ts 10.0.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { GridItemHTMLElement, GridStackElement, DDDragInOpt } from './types';
import { Utils } from './utils';
import { DDManager } from './dd-manager';
import { DDElement, DDElementHost } from './dd-element';

/** Drag&Drop drop options */
export type DDDropOpt = {
  /** function or class type that this grid will accept as dropped items (see GridStackOptions.acceptWidgets) */
  accept?: (el: GridItemHTMLElement) => boolean;
}

/** drag&drop options currently called from the main code, but others can be passed in grid options */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DDOpts = 'enable' | 'disable' | 'destroy' | 'option' | string | any;
export type DDKey = 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight';
export type DDValue = number | string;

/** drag&drop events callbacks */
export type DDCallback = (event: Event, arg2: GridItemHTMLElement, helper?: GridItemHTMLElement) => void;

// let count = 0; // TEST

/**
 * HTML Native Mouse and Touch Events Drag and Drop functionality.
 */
export class DDGridStack {

  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): DDGridStack {
    this._getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddResizable && dEl.ddResizable[opts](); // can't create DD as it requires options for setupResizable()
      } else if (opts === 'destroy') {
        dEl.ddResizable && dEl.cleanResizable();
      } else if (opts === 'option') {
        dEl.setupResizable({ [key]: value });
      } else {
        const grid = dEl.el.gridstackNode.grid;
        let handles = dEl.el.getAttribute('gs-resize-handles') ? dEl.el.getAttribute('gs-resize-handles') : grid.opts.resizable.handles;
        let autoHide = !grid.opts.alwaysShowResizeHandle;
        dEl.setupResizable({
          ...grid.opts.resizable,
          ...{ handles, autoHide },
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

  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): DDGridStack {
    this._getDDElements(el).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddDraggable && dEl.ddDraggable[opts](); // can't create DD as it requires options for setupDraggable()
      } else if (opts === 'destroy') {
        dEl.ddDraggable && dEl.cleanDraggable();
      } else if (opts === 'option') {
        dEl.setupDraggable({ [key]: value });
      } else {
        const grid = dEl.el.gridstackNode.grid;
        dEl.setupDraggable({
          ...grid.opts.draggable,
          ...{
            // containment: (grid.parentGridItem && !grid.opts.dragOut) ? grid.el.parentElement : (grid.opts.draggable.containment || null),
            start: opts.start,
            stop: opts.stop,
            drag: opts.drag
          }
        });
      }
    });
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragInOpt): DDGridStack {
    this._getDDElements(el).forEach(dEl => dEl.setupDraggable(opts));
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): DDGridStack {
    if (typeof opts.accept === 'function' && !opts._accept) {
      opts._accept = opts.accept;
      opts.accept = (el) => opts._accept(el);
    }
    this._getDDElements(el).forEach(dEl => {
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

  /** true if element is droppable */
  public isDroppable(el: DDElementHost): boolean {
    return !!(el && el.ddElement && el.ddElement.ddDroppable && !el.ddElement.ddDroppable.disabled);
  }

  /** true if element is draggable */
  public isDraggable(el: DDElementHost): boolean {
    return !!(el && el.ddElement && el.ddElement.ddDraggable && !el.ddElement.ddDraggable.disabled);
  }

  /** true if element is draggable */
  public isResizable(el: DDElementHost): boolean {
    return !!(el && el.ddElement && el.ddElement.ddResizable && !el.ddElement.ddResizable.disabled);
  }

  public on(el: GridItemHTMLElement, name: string, callback: DDCallback): DDGridStack {
    this._getDDElements(el).forEach(dEl =>
      dEl.on(name, (event: Event) => {
        callback(
          event,
          DDManager.dragElement ? DDManager.dragElement.el : event.target as GridItemHTMLElement,
          DDManager.dragElement ? DDManager.dragElement.helper : null)
      })
    );
    return this;
  }

  public off(el: GridItemHTMLElement, name: string): DDGridStack {
    this._getDDElements(el).forEach(dEl => dEl.off(name));
    return this;
  }

  /** @internal returns a list of DD elements, creating them on the fly by default */
  protected _getDDElements(els: GridStackElement, create = true): DDElement[] {
    let hosts = Utils.getElements(els) as DDElementHost[];
    if (!hosts.length) return [];
    let list = hosts.map(e => e.ddElement || (create ? DDElement.init(e) : null));
    if (!create) { list.filter(d => d); } // remove nulls
    return list;
  }
}
