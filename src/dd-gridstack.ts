/**
 * dd-gridstack.ts 12.3.3
 * Copyright (c) 2021-2025 Alain Dumesny - see GridStack root license
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { GridItemHTMLElement, GridStackElement, DDDragOpt } from './types';
import { Utils } from './utils';
import { DDManager } from './dd-manager';
import { DDElement, DDElementHost } from './dd-element';
import { GridHTMLElement } from './gridstack';

/**
 * Drag & Drop options for drop targets.
 * Configures which elements can be dropped onto a grid.
 */
export type DDDropOpt = {
  /** Function to determine if an element can be dropped (see GridStackOptions.acceptWidgets) */
  accept?: (el: GridItemHTMLElement) => boolean;
}

/**
 * Drag & Drop operation types used throughout the DD system.
 * Can be control commands or configuration objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DDOpts = 'enable' | 'disable' | 'destroy' | 'option' | string | any;

/**
 * Keys for DD configuration options that can be set via the 'option' command.
 */
export type DDKey = 'minWidth' | 'minHeight' | 'maxWidth' | 'maxHeight' | 'maxHeightMoveUp' | 'maxWidthMoveLeft';

/**
 * Values for DD configuration options (numbers or strings with units).
 */
export type DDValue = number | string;

/**
 * Callback function type for drag & drop events.
 *
 * @param event - The DOM event that triggered the callback
 * @param arg2 - The grid item element being dragged/dropped
 * @param helper - Optional helper element used during drag operations
 */
export type DDCallback = (event: Event, arg2: GridItemHTMLElement, helper?: GridItemHTMLElement) => void;

// let count = 0; // TEST

/**
 * HTML Native Mouse and Touch Events Drag and Drop functionality.
 *
 * This class provides the main drag & drop implementation for GridStack,
 * handling resizing, dragging, and dropping of grid items using native HTML5 events.
 * It manages the interaction between different DD components and the grid system.
 */
export class DDGridStack {

  /**
   * Enable/disable/configure resizing for grid elements.
   *
   * @param el - Grid item element(s) to configure
   * @param opts - Resize options or command ('enable', 'disable', 'destroy', 'option', or config object)
   * @param key - Option key when using 'option' command
   * @param value - Option value when using 'option' command
   * @returns this instance for chaining
   *
   * @example
   * dd.resizable(element, 'enable');  // Enable resizing
   * dd.resizable(element, 'option', 'minWidth', 100);  // Set minimum width
   */
  public resizable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): DDGridStack {
    this._getDDElements(el, opts).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddResizable && dEl.ddResizable[opts](); // can't create DD as it requires options for setupResizable()
      } else if (opts === 'destroy') {
        dEl.ddResizable && dEl.cleanResizable();
      } else if (opts === 'option') {
        dEl.setupResizable({ [key]: value });
      } else {
        const n = dEl.el.gridstackNode;
        const grid = n.grid;
        let handles = dEl.el.getAttribute('gs-resize-handles') || grid.opts.resizable.handles || 'e,s,se';
        if (handles === 'all') handles = 'n,e,s,w,se,sw,ne,nw';
        // NOTE: keep the resize handles as e,w don't have enough space (10px) to show resize corners anyway. limit during drag instead
        // restrict vertical resize if height is done to match content anyway... odd to have it spring back
        // if (Utils.shouldSizeToContent(n, true)) {
        //   const doE = handles.indexOf('e') !== -1;
        //   const doW = handles.indexOf('w') !== -1;
        //   handles = doE ? (doW ? 'e,w' : 'e') : (doW ? 'w' : '');
        // }
        const autoHide = !grid.opts.alwaysShowResizeHandle;
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

  /**
   * Enable/disable/configure dragging for grid elements.
   *
   * @param el - Grid item element(s) to configure
   * @param opts - Drag options or command ('enable', 'disable', 'destroy', 'option', or config object)
   * @param key - Option key when using 'option' command
   * @param value - Option value when using 'option' command
   * @returns this instance for chaining
   *
   * @example
   * dd.draggable(element, 'enable');  // Enable dragging
   * dd.draggable(element, {handle: '.drag-handle'});  // Configure drag handle
   */
  public draggable(el: GridItemHTMLElement, opts: DDOpts, key?: DDKey, value?: DDValue): DDGridStack {
    this._getDDElements(el, opts).forEach(dEl => {
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
            // containment: (grid.parentGridNode && grid.opts.dragOut === false) ? grid.el.parentElement : (grid.opts.draggable.containment || null),
            start: opts.start,
            stop: opts.stop,
            drag: opts.drag
          }
        });
      }
    });
    return this;
  }

  public dragIn(el: GridStackElement, opts: DDDragOpt): DDGridStack {
    this._getDDElements(el).forEach(dEl => dEl.setupDraggable(opts));
    return this;
  }

  public droppable(el: GridItemHTMLElement, opts: DDOpts | DDDropOpt, key?: DDKey, value?: DDValue): DDGridStack {
    if (typeof opts.accept === 'function' && !opts._accept) {
      opts._accept = opts.accept;
      opts.accept = (el) => opts._accept(el);
    }
    this._getDDElements(el, opts).forEach(dEl => {
      if (opts === 'disable' || opts === 'enable') {
        dEl.ddDroppable && dEl.ddDroppable[opts]();
      } else if (opts === 'destroy') {
        dEl.ddDroppable && dEl.cleanDroppable();
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
    return !!(el?.ddElement?.ddDroppable && !el.ddElement.ddDroppable.disabled);
  }

  /** true if element is draggable */
  public isDraggable(el: DDElementHost): boolean {
    return !!(el?.ddElement?.ddDraggable && !el.ddElement.ddDraggable.disabled);
  }

  /** true if element is draggable */
  public isResizable(el: DDElementHost): boolean {
    return !!(el?.ddElement?.ddResizable && !el.ddElement.ddResizable.disabled);
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

  /** @internal returns a list of DD elements, creating them on the fly by default unless option is to destroy or disable */
  protected _getDDElements(els: GridStackElement, opts?: DDOpts): DDElement[] {
    // don't force create if we're going to destroy it, unless it's a grid which is used as drop target for it's children
    const create = (els as GridHTMLElement).gridstack ||  opts !== 'destroy' && opts !== 'disable';
    const hosts = Utils.getElements(els) as DDElementHost[];
    if (!hosts.length) return [];
    const list = hosts.map(e => e.ddElement || (create ? DDElement.init(e) : null)).filter(d => d); // remove nulls
    return list;
  }
}
