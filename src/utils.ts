/**
 * utils.ts 10.0.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

import { GridStackElement, GridStackNode, GridStackOptions, numberOrString, GridStackPosition, GridStackWidget } from './types';

export interface HeightData {
  h: number;
  unit: string;
}

/** checks for obsolete method names */
// eslint-disable-next-line
export function obsolete(self, f, oldName: string, newName: string, rev: string): (...args: any[]) => any {
  let wrapper = (...args) => {
    console.warn('gridstack.js: Function `' + oldName + '` is deprecated in ' + rev + ' and has been replaced ' +
    'with `' + newName + '`. It will be **removed** in a future release');
    return f.apply(self, args);
  }
  wrapper.prototype = f.prototype;
  return wrapper;
}

/** checks for obsolete grid options (can be used for any fields, but msg is about options) */
export function obsoleteOpts(opts: GridStackOptions, oldName: string, newName: string, rev: string): void {
  if (opts[oldName] !== undefined) {
    opts[newName] = opts[oldName];
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **removed** in a future release');
  }
}

/** checks for obsolete grid options which are gone */
export function obsoleteOptsDel(opts: GridStackOptions, oldName: string, rev: string, info: string): void {
  if (opts[oldName] !== undefined) {
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + info);
  }
}

/** checks for obsolete Jquery element attributes */
export function obsoleteAttr(el: HTMLElement, oldName: string, newName: string, rev: string): void {
  let oldAttr = el.getAttribute(oldName);
  if (oldAttr !== null) {
    el.setAttribute(newName, oldAttr);
    console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **removed** in a future release');
  }
}

/**
 * Utility methods
 */
export class Utils {

  /** convert a potential selector into actual list of html elements. optional root which defaults to document (for shadow dom) */
  static getElements(els: GridStackElement, root: HTMLElement | Document = document): HTMLElement[] {
    if (typeof els === 'string') {
      const doc = ('getElementById' in root) ? root as Document : undefined;

      // Note: very common for people use to id='1,2,3' which is only legal as HTML5 id, but not CSS selectors
      // so if we start with a number, assume it's an id and just return that one item...
      // see https://github.com/gridstack/gridstack.js/issues/2234#issuecomment-1523796562
      if (doc && !isNaN(+els[0])) { // start with digit
        const el = doc.getElementById(els);
        return el ? [el] : [];
      }

      let list = root.querySelectorAll(els);
      if (!list.length && els[0] !== '.' && els[0] !== '#') {
        list = root.querySelectorAll('.' + els);
        if (!list.length) { list = root.querySelectorAll('#' + els) }
      }
      return Array.from(list) as HTMLElement[];
    }
    return [els];
  }

  /** convert a potential selector into actual single element. optional root which defaults to document (for shadow dom) */
  static getElement(els: GridStackElement, root: HTMLElement | Document = document): HTMLElement {
    if (typeof els === 'string') {
      const doc = ('getElementById' in root) ? root as Document : undefined;
      if (!els.length) return null;
      if (doc && els[0] === '#') {
        return doc.getElementById(els.substring(1));
      }
      if (els[0] === '#' || els[0] === '.' || els[0] === '[') {
        return root.querySelector(els);
      }

      // if we start with a digit, assume it's an id (error calling querySelector('#1')) as class are not valid CSS
      if (doc && !isNaN(+els[0])) { // start with digit
        return doc.getElementById(els);
      }

      // finally try string, then id, then class
      let el = root.querySelector(els);
      if (doc && !el) { el = doc.getElementById(els) }
      if (!el) { el = root.querySelector('.' + els) }
      return el as HTMLElement;
    }
    return els;
  }

  /** true if we should resize to content */
  static shouldSizeToContent(n: GridStackNode | undefined): boolean {
    return n?.grid && (!!n.sizeToContent || (n.grid.opts.sizeToContent && n.sizeToContent !== false));
  }

  /** returns true if a and b overlap */
  static isIntercepted(a: GridStackPosition, b: GridStackPosition): boolean {
    return !(a.y >= b.y + b.h || a.y + a.h <= b.y || a.x + a.w <= b.x || a.x >= b.x + b.w);
  }

  /** returns true if a and b touch edges or corners */
  static isTouching(a: GridStackPosition, b: GridStackPosition): boolean {
    return Utils.isIntercepted(a, {x: b.x-0.5, y: b.y-0.5, w: b.w+1, h: b.h+1})
  }

  /** returns the area a and b overlap */
  static areaIntercept(a: GridStackPosition, b: GridStackPosition): number {
    let x0 = (a.x > b.x) ? a.x : b.x;
    let x1 = (a.x+a.w < b.x+b.w) ? a.x+a.w : b.x+b.w;
    if (x1 <= x0) return 0; // no overlap
    let y0 = (a.y > b.y) ? a.y : b.y;
    let y1 = (a.y+a.h < b.y+b.h) ? a.y+a.h : b.y+b.h;
    if (y1 <= y0) return 0; // no overlap
    return (x1-x0) * (y1-y0);
  }

  /** returns the area */
  static area(a: GridStackPosition): number {
    return a.w * a.h;
  }

  /**
   * Sorts array of nodes
   * @param nodes array to sort
   * @param dir 1 for asc, -1 for desc (optional)
   * @param width width of the grid. If undefined the width will be calculated automatically (optional).
   **/
  static sort(nodes: GridStackNode[], dir: 1 | -1 = 1, column?: number): GridStackNode[] {
    column = column || nodes.reduce((col, n) => Math.max(n.x + n.w, col), 0) || 12;
    if (dir === -1)
      return nodes.sort((a, b) => ((b.x ?? 1000) + (b.y ?? 1000) * column)-((a.x ?? 1000) + (a.y ?? 1000) * column));
    else
      return nodes.sort((b, a) => ((b.x ?? 1000) + (b.y ?? 1000) * column)-((a.x ?? 1000) + (a.y ?? 1000) * column));
  }

  /** find an item by id */
  static find(nodes: GridStackNode[], id: string): GridStackNode | undefined {
    return id ? nodes.find(n => n.id === id) : undefined;
  }

  /**
   * creates a style sheet with style id under given parent
   * @param id will set the 'gs-style-id' attribute to that id
   * @param parent to insert the stylesheet as first child,
   * if none supplied it will be appended to the document head instead.
   */
  static createStylesheet(id: string, parent?: HTMLElement, options?: { nonce?: string }): CSSStyleSheet {
    let style: HTMLStyleElement = document.createElement('style');
    const nonce = options?.nonce
    if (nonce) style.nonce = nonce
    style.setAttribute('type', 'text/css');
    style.setAttribute('gs-style-id', id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((style as any).styleSheet) { // TODO: only CSSImportRule have that and different beast ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (style as any).styleSheet.cssText = '';
    } else {
      style.appendChild(document.createTextNode('')); // WebKit hack
    }
    if (!parent) {
      // default to head
      parent = document.getElementsByTagName('head')[0];
      parent.appendChild(style);
    } else {
      parent.insertBefore(style, parent.firstChild);
    }
    return style.sheet as CSSStyleSheet;
  }

  /** removed the given stylesheet id */
  static removeStylesheet(id: string): void {
    let el = document.querySelector('STYLE[gs-style-id=' + id + ']');
    if (el && el.parentNode) el.remove();
  }

  /** inserts a CSS rule */
  static addCSSRule(sheet: CSSStyleSheet, selector: string, rules: string): void {
    if (typeof sheet.addRule === 'function') {
      sheet.addRule(selector, rules);
    } else if (typeof sheet.insertRule === 'function') {
      sheet.insertRule(`${selector}{${rules}}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toBool(v: unknown): boolean {
    if (typeof v === 'boolean') {
      return v;
    }
    if (typeof v === 'string') {
      v = v.toLowerCase();
      return !(v === '' || v === 'no' || v === 'false' || v === '0');
    }
    return Boolean(v);
  }

  static toNumber(value: null | string): number {
    return (value === null || value.length === 0) ? undefined : Number(value);
  }

  static parseHeight(val: numberOrString): HeightData {
    let h: number;
    let unit = 'px';
    if (typeof val === 'string') {
      if (val === 'auto' || val === '') h = 0;
      else {
        let match = val.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/);
        if (!match) {
          throw new Error(`Invalid height val = ${val}`);
        }
        unit = match[2] || 'px';
        h = parseFloat(match[1]);
      }
    } else {
      h = val;
    }
    return { h, unit };
  }

  /** copies unset fields in target to use the given default sources values */
  // eslint-disable-next-line
  static defaults(target, ...sources): {} {

    sources.forEach(source => {
      for (const key in source) {
        if (!source.hasOwnProperty(key)) return;
        if (target[key] === null || target[key] === undefined) {
          target[key] = source[key];
        } else if (typeof source[key] === 'object' && typeof target[key] === 'object') {
          // property is an object, recursively add it's field over... #1373
          this.defaults(target[key], source[key]);
        }
      }
    });

    return target;
  }

  /** given 2 objects return true if they have the same values. Checks for Object {} having same fields and values (just 1 level down) */
  static same(a: unknown, b: unknown): boolean {
    if (typeof a !== 'object')  return a == b;
    if (typeof a !== typeof b) return false;
    // else we have object, check just 1 level deep for being same things...
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (const key in a) {
      if (a[key] !== b[key]) return false;
    }
    return true;
  }

  /** copies over b size & position (GridStackPosition), and optionally min/max as well */
  static copyPos(a: GridStackWidget, b: GridStackWidget, doMinMax = false): GridStackWidget {
    if (b.x !== undefined) a.x = b.x;
    if (b.y !== undefined) a.y = b.y;
    if (b.w !== undefined) a.w = b.w;
    if (b.h !== undefined) a.h = b.h;
    if (doMinMax) {
      if (b.minW) a.minW = b.minW;
      if (b.minH) a.minH = b.minH;
      if (b.maxW) a.maxW = b.maxW;
      if (b.maxH) a.maxH = b.maxH;
    }
    return a;
  }

  /** true if a and b has same size & position */
  static samePos(a: GridStackPosition, b: GridStackPosition): boolean {
    return a && b && a.x === b.x && a.y === b.y && (a.w || 1) === (b.w || 1) && (a.h || 1) === (b.h || 1);
  }

  /** given a node, makes sure it's min/max are valid */
  static sanitizeMinMax(node: GridStackNode) {
    // remove 0, undefine, null
    if (!node.minW) { delete node.minW; }
    if (!node.minH) { delete node.minH; }
    if (!node.maxW) { delete node.maxW; }
    if (!node.maxH) { delete node.maxH; }
  }

  /** removes field from the first object if same as the second objects (like diffing) and internal '_' for saving */
  static removeInternalAndSame(a: unknown, b: unknown):void {
    if (typeof a !== 'object' || typeof b !== 'object') return;
    for (let key in a) {
      let val = a[key];
      if (key[0] === '_' || val === b[key]) {
        delete a[key]
      } else if (val && typeof val === 'object' && b[key] !== undefined) {
        for (let i in val) {
          if (val[i] === b[key][i] || i[0] === '_') { delete val[i] }
        }
        if (!Object.keys(val).length) { delete a[key] }
      }
    }
  }

  /** removes internal fields '_' and default values for saving */
  static removeInternalForSave(n: GridStackNode, removeEl = true): void {
    for (let key in n) { if (key[0] === '_' || n[key] === null || n[key] === undefined ) delete n[key]; }
    delete n.grid;
    if (removeEl) delete n.el;
    // delete default values (will be re-created on read)
    if (!n.autoPosition) delete n.autoPosition;
    if (!n.noResize) delete n.noResize;
    if (!n.noMove) delete n.noMove;
    if (!n.locked) delete n.locked;
    if (n.w === 1 || n.w === n.minW) delete n.w;
    if (n.h === 1 || n.h === n.minH) delete n.h;
  }

  /** return the closest parent (or itself) matching the given class */
  // static closestUpByClass(el: HTMLElement, name: string): HTMLElement {
  //   while (el) {
  //     if (el.classList.contains(name)) return el;
  //     el = el.parentElement
  //   }
  //   return null;
  // }

  /** delay calling the given function for given delay, preventing new calls from happening while waiting */
  static throttle(func: () => void, delay: number): () => void {
    let isWaiting = false;
    return (...args) => {
      if (!isWaiting) {
        isWaiting = true;
        setTimeout(() => { func(...args); isWaiting = false; }, delay);
      }
    }
  }

  static removePositioningStyles(el: HTMLElement): void {
    let style = el.style;
    if (style.position) {
      style.removeProperty('position');
    }
    if (style.left) {
      style.removeProperty('left');
    }
    if (style.top) {
      style.removeProperty('top');
    }
    if (style.width) {
      style.removeProperty('width');
    }
    if (style.height) {
      style.removeProperty('height');
    }
  }

  /** @internal returns the passed element if scrollable, else the closest parent that will, up to the entire document scrolling element */
  static getScrollElement(el?: HTMLElement): HTMLElement {
    if (!el) return document.scrollingElement as HTMLElement || document.documentElement; // IE support
    const style = getComputedStyle(el);
    const overflowRegex = /(auto|scroll)/;

    if (overflowRegex.test(style.overflow + style.overflowY)) {
      return el;
    } else {
      return this.getScrollElement(el.parentElement);
    }
  }

  /** @internal */
  static updateScrollPosition(el: HTMLElement, position: {top: number}, distance: number): void {
    // is widget in view?
    let rect = el.getBoundingClientRect();
    let innerHeightOrClientHeight = (window.innerHeight || document.documentElement.clientHeight);
    if (rect.top < 0 ||
      rect.bottom > innerHeightOrClientHeight
    ) {
      // set scrollTop of first parent that scrolls
      // if parent is larger than el, set as low as possible
      // to get entire widget on screen
      let offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
      let offsetDiffUp = rect.top;
      let scrollEl = this.getScrollElement(el);
      if (scrollEl !== null) {
        let prevScroll = scrollEl.scrollTop;
        if (rect.top < 0 && distance < 0) {
          // moving up
          if (el.offsetHeight > innerHeightOrClientHeight) {
            scrollEl.scrollTop += distance;
          } else {
            scrollEl.scrollTop += Math.abs(offsetDiffUp) > Math.abs(distance) ? distance : offsetDiffUp;
          }
        } else if (distance > 0) {
          // moving down
          if (el.offsetHeight > innerHeightOrClientHeight) {
            scrollEl.scrollTop += distance;
          } else {
            scrollEl.scrollTop += offsetDiffDown > distance ? distance : offsetDiffDown;
          }
        }
        // move widget y by amount scrolled
        position.top += scrollEl.scrollTop - prevScroll;
      }
    }
  }

  /**
   * @internal Function used to scroll the page.
   *
   * @param event `MouseEvent` that triggers the resize
   * @param el `HTMLElement` that's being resized
   * @param distance Distance from the V edges to start scrolling
   */
  static updateScrollResize(event: MouseEvent, el: HTMLElement, distance: number): void {
    const scrollEl = this.getScrollElement(el);
    const height = scrollEl.clientHeight;
    // #1727 event.clientY is relative to viewport, so must compare this against position of scrollEl getBoundingClientRect().top
    // #1745 Special situation if scrollEl is document 'html': here browser spec states that
    // clientHeight is height of viewport, but getBoundingClientRect() is rectangle of html element;
    // this discrepancy arises because in reality scrollbar is attached to viewport, not html element itself.
    const offsetTop = (scrollEl === this.getScrollElement()) ? 0 : scrollEl.getBoundingClientRect().top;
    const pointerPosY = event.clientY - offsetTop;
    const top = pointerPosY < distance;
    const bottom = pointerPosY > height - distance;

    if (top) {
      // This also can be done with a timeout to keep scrolling while the mouse is
      // in the scrolling zone. (will have smoother behavior)
      scrollEl.scrollBy({ behavior: 'smooth', top: pointerPosY - distance});
    } else if (bottom) {
      scrollEl.scrollBy({ behavior: 'smooth', top: distance - (height - pointerPosY)});
    }
  }

  /** single level clone, returning a new object with same top fields. This will share sub objects and arrays */
  static clone<T>(obj: T): T {
    if (obj === null || obj === undefined || typeof(obj) !== 'object') {
      return obj;
    }
    // return Object.assign({}, obj);
    if (obj instanceof Array) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return [...obj] as any;
    }
    return {...obj};
  }

  /**
   * Recursive clone version that returns a full copy, checking for nested objects and arrays ONLY.
   * Note: this will use as-is any key starting with double __ (and not copy inside) some lib have circular dependencies.
   */
  static cloneDeep<T>(obj: T): T {
    // list of fields we will skip during cloneDeep (nested objects, other internal)
    const skipFields = ['parentGrid', 'el', 'grid', 'subGrid', 'engine'];
    // return JSON.parse(JSON.stringify(obj)); // doesn't work with date format ?
    const ret = Utils.clone(obj);
    for (const key in ret) {
      // NOTE: we don't support function/circular dependencies so skip those properties for now...
      if (ret.hasOwnProperty(key) && typeof(ret[key]) === 'object' && key.substring(0, 2) !== '__' && !skipFields.find(k => k === key)) {
        ret[key] = Utils.cloneDeep(obj[key]);
      }
    }
    return ret;
  }

  /** deep clone the given HTML node, removing teh unique id field */
  public static cloneNode(el: HTMLElement): HTMLElement {
    const node = el.cloneNode(true) as HTMLElement;
    node.removeAttribute('id');
    return node;
  }

  public static appendTo(el: HTMLElement, parent: string | HTMLElement): void {
    let parentNode: HTMLElement;
    if (typeof parent === 'string') {
      parentNode = Utils.getElement(parent);
    } else {
      parentNode = parent;
    }
    if (parentNode) {
      parentNode.appendChild(el);
    }
  }

  // public static setPositionRelative(el: HTMLElement): void {
  //   if (!(/^(?:r|a|f)/).test(getComputedStyle(el).position)) {
  //     el.style.position = "relative";
  //   }
  // }

  public static addElStyles(el: HTMLElement, styles: { [prop: string]: string | string[] }): void {
    if (styles instanceof Object) {
      for (const s in styles) {
        if (styles.hasOwnProperty(s)) {
          if (Array.isArray(styles[s])) {
            // support fallback value
            (styles[s] as string[]).forEach(val => {
              el.style[s] = val;
            });
          } else {
            el.style[s] = styles[s];
          }
        }
      }
    }
  }

  public static initEvent<T>(e: DragEvent | MouseEvent, info: { type: string; target?: EventTarget }): T {
    const evt = { type: info.type };
    const obj = {
      button: 0,
      which: 0,
      buttons: 1,
      bubbles: true,
      cancelable: true,
      target: info.target ? info.target : e.target
    };
    // don't check for `instanceof DragEvent` as Safari use MouseEvent #1540
    if ((e as DragEvent).dataTransfer) {
      evt['dataTransfer'] = (e as DragEvent).dataTransfer; // workaround 'readonly' field.
    }
    ['altKey','ctrlKey','metaKey','shiftKey'].forEach(p => evt[p] = e[p]); // keys
    ['pageX','pageY','clientX','clientY','screenX','screenY'].forEach(p => evt[p] = e[p]); // point info
    return {...evt, ...obj} as unknown as T;
  }

  /** copies the MouseEvent properties and sends it as another event to the given target */
  public static simulateMouseEvent(e: MouseEvent, simulatedType: string, target?: EventTarget): void {
    const simulatedEvent = document.createEvent('MouseEvents');
    simulatedEvent.initMouseEvent(
      simulatedType, // type
      true,         // bubbles
      true,         // cancelable
      window,       // view
      1,            // detail
      e.screenX,    // screenX
      e.screenY,    // screenY
      e.clientX,    // clientX
      e.clientY,    // clientY
      e.ctrlKey,    // ctrlKey
      e.altKey,     // altKey
      e.shiftKey,   // shiftKey
      e.metaKey,    // metaKey
      0,            // button
      e.target      // relatedTarget
    );
    (target || e.target).dispatchEvent(simulatedEvent);
  }

  /** returns true if event is inside the given element rectangle */
  // Note: Safari Mac has null event.relatedTarget which causes #1684 so check if DragEvent is inside the coordinates instead
  //    this.el.contains(event.relatedTarget as HTMLElement)
  // public static inside(e: MouseEvent, el: HTMLElement): boolean {
  //   // srcElement, toElement, target: all set to placeholder when leaving simple grid, so we can't use that (Chrome)
  //   let target: HTMLElement = e.relatedTarget || (e as any).fromElement;
  //   if (!target) {
  //     const { bottom, left, right, top } = el.getBoundingClientRect();
  //     return (e.x < right && e.x > left && e.y < bottom && e.y > top);
  //   }
  //   return el.contains(target);
  // }
}
