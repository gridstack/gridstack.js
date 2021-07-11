/**
 * dd-utils.ts 4.2.6
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */
export class DDUtils {

  public static isEventSupportPassiveOption = ((() => {
    let supportsPassive = false;
    let passiveTest = () => {
      // do nothing
    };
    document.addEventListener('test', passiveTest, {
      get passive() {
        supportsPassive = true;
        return true;
      }
    });
    document.removeEventListener('test', passiveTest);
    return supportsPassive;
  })());

  public static clone(el: HTMLElement): HTMLElement {
    const node = el.cloneNode(true) as HTMLElement;
    node.removeAttribute('id');
    return node;
  }

  public static appendTo(el: HTMLElement, parent: string | HTMLElement | Node): void {
    let parentNode: HTMLElement;
    if (typeof parent === 'string') {
      parentNode = document.querySelector(parent as string);
    } else {
      parentNode = parent as HTMLElement;
    }
    if (parentNode) {
      parentNode.appendChild(el);
    }
  }

  public static setPositionRelative(el: HTMLElement): void {
    if (!(/^(?:r|a|f)/).test(window.getComputedStyle(el).position)) {
      el.style.position = "relative";
    }
  }

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
}