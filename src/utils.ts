/** utils.ts 1.0.0-rc
 * https://gridstackjs.com/
 * (c) 2014-2020 Alain Dumesny, Dylan Weiss, Pavel Reznikov
 * gridstack.js may be freely distributed under the MIT license.
 * @preserve
*/

import { GridstackWidget, GridStackNode, GridstackOptions, numberOrString } from './types';

/** checks for obsolete method names */
export function obsolete(f, oldName: string, newName: string, rev: string) {
  var wrapper = function() {
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
  var oldAttr = el.getAttribute(oldName);
  if (oldAttr !== undefined) {
    el.setAttribute(newName, oldAttr);
    console.warn('gridstack.js: attribute `' + oldName + '`=' + oldAttr + ' is deprecated on this object in ' + rev + ' and has been replaced with `' +
      newName + '`. It will be **completely** removed in v1.0');
  }
}


/**
 * Utility methods
 */
export namespace Utils {

  /** returns true if a and b overlap */
  export function isIntercepted(a: GridstackWidget, b: GridstackWidget): boolean {
    return !(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y);
  }

  /**
   * Sorts array of nodes
   * @param nodes array to sort
   * @param dir 1 for asc, -1 for desc (optional)
   * @param width width of the grid. If undefined the width will be calculated automatically (optional).
   **/
  export function sort(nodes: GridStackNode[], dir?: number, column?: number): GridStackNode[] {
    if (!column) {
      var widths = nodes.map(function (node) { return node.x + node.width; });
      column = Math.max.apply(Math, widths);
    }

    if (dir === -1)
      return sortBy(nodes, (n) => -(n.x + n.y * column));
    else
      return sortBy(nodes, (n) => (n.x + n.y * column));
  }

  export function createStylesheet(id: string, parent?: HTMLElement): CSSStyleSheet {
    var style: HTMLStyleElement = document.createElement('style');
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

  export function removeStylesheet(id: string) {
    var el = document.querySelector('STYLE[data-gs-style-id=' + id + ']');
    if (!el) return;
    el.parentNode.removeChild(el);
  }

  export function insertCSSRule(sheet: CSSStyleSheet, selector: string, rules: string, index: number) {
    if (typeof sheet.insertRule === 'function') {
      sheet.insertRule(selector + '{' + rules + '}', index);
    } else if (typeof sheet.addRule === 'function') {
      sheet.addRule(selector, rules, index);
    }
  }

  export function toBool(v: any): boolean {
    if (typeof v === 'boolean') {
      return v;
    }
    if (typeof v === 'string') {
      v = v.toLowerCase();
      return !(v === '' || v === 'no' || v === 'false' || v === '0');
    }
    return Boolean(v);
  }

  export function parseHeight(val: numberOrString) {
    var height: number;
    var heightUnit = 'px';
    if (typeof val === 'string') {
      var match = val.match(/^(-[0-9]+\.[0-9]+|[0-9]*\.[0-9]+|-[0-9]+|[0-9]+)(px|em|rem|vh|vw|%)?$/);
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

  export function without(array, item) {
    var index = array.indexOf(item);

    if (index !== -1) {
      array = array.slice(0);
      array.splice(index, 1);
    }

    return array;
  }

  export function sortBy(array, getter) {
    return array.slice(0).sort(function (left, right) {
      var valueLeft = getter(left);
      var valueRight = getter(right);

      if (valueRight === valueLeft) {
        return 0;
      }

      return valueLeft > valueRight ? 1 : -1;
    });
  }

  export function defaults(target, arg1) {
    var sources = Array.prototype.slice.call(arguments, 1);

    sources.forEach(function (source) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop) && (!target.hasOwnProperty(prop) || target[prop] === undefined)) {
          target[prop] = source[prop];
        }
      }
    });

    return target;
  }

  export function clone(target) {
    return {...target}; // was $.extend({}, target)
  }

  export function throttle(callback, delay) {
    var isWaiting = false;

    return function () {
      if (!isWaiting) {
        callback.apply(this, arguments);
        isWaiting = true;
        setTimeout(function () { isWaiting = false; }, delay);
      }
    }
  }

  export function removePositioningStyles(el) {
    var style = el[0].style;
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

  export function getScrollParent(el) {
    var returnEl;
    if (el === null) {
      returnEl = null;
    } else if (el.scrollHeight > el.clientHeight) {
      returnEl = el;
    } else {
      returnEl = getScrollParent(el.parentNode);
    }
    return returnEl;
  }

  export function updateScrollPosition(el, ui, distance) {
    // is widget in view?
    var rect = el.getBoundingClientRect();
    var innerHeightOrClientHeight = (window.innerHeight || document.documentElement.clientHeight);
    if (rect.top < 0 ||
      rect.bottom > innerHeightOrClientHeight
    ) {
      // set scrollTop of first parent that scrolls
      // if parent is larger than el, set as low as possible
      // to get entire widget on screen
      var offsetDiffDown = rect.bottom - innerHeightOrClientHeight;
      var offsetDiffUp = rect.top;
      var scrollEl = getScrollParent(el);
      if (scrollEl !== null) {
        var prevScroll = scrollEl.scrollTop;
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