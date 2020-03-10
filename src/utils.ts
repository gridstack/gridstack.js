// utils.ts 2.0.0-rc @preserve

/**
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
*/

import { GridstackWidget, GridStackNode, GridstackOptions, numberOrString } from './types';

/** checks for obsolete method names */
export function obsolete(f, oldName: string, newName: string, rev: string) {
  const wrapper = function() {
    console.warn('gridstack.js: Function `' + oldName + '` is deprecated in ' + rev + ' and has been replaced ' +
    'with `' + newName + '`. It will be **completely** removed in v1.0');
    return f.apply(this, arguments);
  }
  wrapper.prototype = f.prototype;
  return wrapper;
}

/** checks for obsolete grid options (can be used for any fields, but msg is about options) */
export function obsoleteOpts(opts: GridstackOptions, oldName: string, newName: string, rev: string) {
  if (opts[oldName] !== undefined) {
    opts[newName] = opts[oldName];
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **completely** removed in v1.0');
  }
}

/** checks for obsolete grid options which are gone */
export function obsoleteOptsDel(opts: GridstackOptions, oldName: string, rev: string, info: string) {
  if (opts[oldName] !== undefined) {
    console.warn('gridstack.js: Option `' + oldName + '` is deprecated in ' + rev + info);
  }
}

/** checks for obsolete Jquery element attributes */
export function obsoleteAttr(el: HTMLElement, oldName: string, newName: string, rev: string) {
  const oldAttr = el.getAttribute(oldName);
  if (oldAttr !== null) {
    el.setAttribute(newName, oldAttr);
    console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **completely** removed in v1.0');
  }
}


/**
 * Utility methods
 */
export class Utils {

  /** returns true if a and b overlap */
  static isIntercepted(a: GridstackWidget, b: GridstackWidget): boolean {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
  }

  /**
   * Sorts array of nodes
   * @param nodes array to sort
   * @param dir 1 for asc, -1 for desc (optional)
   * @param width width of the grid. If undefined the width will be calculated automatically (optional).
   **/
  static sort(nodes: GridStackNode[], dir?: number, column?: number): GridStackNode[] {
    if (!column) {
      const widths = nodes.map(function (node) { return node.x + node.width; });
      column = Math.max.apply(Math, widths);
    }

    if (dir === -1)
      return this.sortBy(nodes, (n) => -(n.x + n.y * column));
    else
      return this.sortBy(nodes, (n) => (n.x + n.y * column));
  }

  static createStylesheet(id: string, parent?: HTMLElement): CSSStyleSheet {
    const style: HTMLStyleElement = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('data-gs-style-id', id);
    if ((style as any).styleSheet) { // ??? only CSSImportRule have that and different beast...
      (style as any).styleSheet.cssText = '';
    } else {
      style.appendChild(document.createTextNode('')); // WebKit hack
    }
    if (!parent) { parent = document.getElementsByTagName('head')[0]; } // default to head
    parent.insertBefore(style, parent.firstChild);
    return style.sheet as CSSStyleSheet;
  }

  static removeStylesheet(id: string) {
    const el = document.querySelector('STYLE[data-gs-style-id=' + id + ']');
    if (!el) return;
    el.parentNode.removeChild(el);
  }

  static insertCSSRule(sheet: CSSStyleSheet, selector: string, rules: string, index: number) {
    if (typeof sheet.insertRule === 'function') {
      sheet.insertRule(selector + '{' + rules + '}', index);
    } else if (typeof sheet.addRule === 'function') {
      sheet.addRule(selector, rules, index);
    }
  }

  static toBool(v: any): boolean {
    if (typeof v === 'boolean') {
      return v;
    }
    if (typeof v === 'string') {
      v = v.toLowerCase();
      return !(v === '' || v === 'no' || v === 'false' || v === '0');
    }
    return Boolean(v);
  }

  static toNumber(value: null | string): number | null {
    return value === null || value.length === 0
      ? null
      : Number(value);
  }

  static parseHeight(val: numberOrString) {
    let height: number;
    let heightUnit = 'px';
    if (typeof val === 'string') {
      const match = val.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/);
      if (!match) {
        throw new Error('Invalid height');
      }
      heightUnit = match[2] || 'px';
      height = parseFloat(match[1]);
    } else {
      height = val;
    }
    return { height: height, unit: heightUnit }
  }

  static without(array, item) {
    const index = array.indexOf(item);

    if (index !== -1) {
      array = array.slice(0);
      array.splice(index, 1);
    }

    return array;
  }

  static sortBy(array, getter) {
    return array.slice(0).sort(function (left, right) {
      const valueLeft = getter(left);
      const valueRight = getter(right);

      if (valueRight === valueLeft) {
        return 0;
      }

      return valueLeft > valueRight ? 1 : -1;
    });
  }

  static defaults(target, arg1) {
    const sources = Array.prototype.slice.call(arguments, 1);

    sources.forEach(function (source) {
      for (let prop in source) {
        if (source.hasOwnProperty(prop) && (!target.hasOwnProperty(prop) || target[prop] === undefined)) {
          target[prop] = source[prop];
        }
      }
    });

    return target;
  }

  static clone(target) {
    return {...target}; // was $.extend({}, target)
  }

  static throttle(callback, delay) {
    let isWaiting = false;

    return function () {
      if (!isWaiting) {
        callback.apply(this, arguments);
        isWaiting = true;
        setTimeout(function () { isWaiting = false; }, delay);
      }
    }
  }

  static removePositioningStyles(el) {
    const style = el.style;
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

  static getScrollParent(el) {
    let returnEl;
    if (el === null) {
      returnEl = null;
    } else if (el.scrollHeight > el.clientHeight) {
      returnEl = el;
    } else {
      returnEl = this.getScrollParent(el.parentNode);
    }
    return returnEl;
  }

  static updateScrollPosition(el, ui, distance) {
    // is widget in view?
    const rect = el.getBoundingClientRect();
    const innerHeightOrClientHeight = (window.innerHeight || document.documentElement.clientHeight);
    if (rect.top < 0 ||
      rect.bottom > innerHeightOrClientHeight
    ) {
      // set scrollTop of first parent that scrolls
      // if parent is larger than el, set as low as possible
      // to get entire widget on screen
      const offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
      const offsetDiffUp = rect.top;
      const scrollEl = this.getScrollParent(el);
      if (scrollEl !== null) {
        const prevScroll = scrollEl.scrollTop;
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
        ui.position.top += scrollEl.scrollTop - prevScroll;
      }
    }
  }
}
