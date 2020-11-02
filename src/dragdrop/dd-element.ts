// dd-elements.ts 2.0.2-dev @preserve
/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDResizable, DDResizableOpt } from './dd-resizable';
import { GridItemHTMLElement } from './../types';
import { DDDraggable, DDDraggableOpt } from './dd-draggable';
import { DDDroppable, DDDroppableOpt } from './dd-droppable';
export interface DDElementHost extends GridItemHTMLElement {
  ddElement?: DDElement;
}
export class DDElement {
  static init(el) {
    el.ddElement = new DDElement(el);
    return el.ddElement;
  }
  el: DDElementHost;
  ddDraggable?: DDDraggable;
  ddDroppable?: DDDroppable;
  ddResizable?: DDResizable;
  constructor(el: DDElementHost) {
    this.el = el;
  }
  on(eventName: string, callback: (event: MouseEvent) => void) {
    if (this.ddDraggable && ['drag', 'dragstart', 'dragstop'].indexOf(eventName) > -1) {
      this.ddDraggable.on(eventName as 'drag' | 'dragstart' | 'dragstop', callback);
      return;
    }
    if (this.ddDroppable && ['drop', 'dropover', 'dropout'].indexOf(eventName) > -1) {
      this.ddDroppable.on(eventName as 'drop' | 'dropover' | 'dropout', callback);
      return;
    }
    if (this.ddResizable && ['resizestart', 'resize', 'resizestop'].indexOf(eventName) > -1) {
      this.ddResizable.on(eventName as 'resizestart' | 'resize' | 'resizestop', callback);
      return;
    }
    return;
  }
  off(eventName: string) {
    if (this.ddDraggable && ['drag', 'dragstart', 'dragstop'].indexOf(eventName) > -1) {
      this.ddDraggable.off(eventName as 'drag' | 'dragstart' | 'dragstop');
      return;
    }
    if (this.ddDroppable && ['drop', 'dropover', 'dropout'].indexOf(eventName) > -1) {
      this.ddDroppable.off(eventName as 'drop' | 'dropover' | 'dropout');
      return;
    }
    if (this.ddResizable && ['resizestart', 'resize', 'resizestop'].indexOf(eventName) > -1) {
      this.ddResizable.off(eventName as 'resizestart' | 'resize' | 'resizestop');
      return;
    }
    return;
  }
  setupDraggable(opts: DDDraggableOpt) {
    if (!this.ddDraggable) {
      this.ddDraggable = new DDDraggable(this.el, opts);
    } else {
      this.ddDraggable.updateOption(opts);
    }
  }
  setupResizable(opts: DDResizableOpt) {
    if (!this.ddResizable) {
      this.ddResizable = new DDResizable(this.el, opts);
    } else {
      this.ddResizable.updateOption(opts);
    }
  }
  cleanDraggable() {
    if (!this.ddDraggable) { return; }
    this.ddDraggable.destroy();
    this.ddDraggable = undefined;
  }
  setupDroppable(opts: DDDroppableOpt) {
    if (!this.ddDroppable) {
      this.ddDroppable = new DDDroppable(this.el, opts);
    } else {
      this.ddDroppable.updateOption(opts);
    }
  }
  cleanDroppable() {
    if (!this.ddDroppable) { return; }
    this.ddDroppable.destroy();
    this.ddDroppable = undefined;
  }
  cleanResizable() {
    if (!this.cleanResizable) { return; }
    this.ddResizable.destroy();
    this.ddResizable = undefined;
  }
}
