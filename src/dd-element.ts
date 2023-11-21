/**
 * dd-elements.ts 10.0.0-dev
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

import { DDResizable, DDResizableOpt } from './dd-resizable';
import { GridItemHTMLElement } from './types';
import { DDDraggable, DDDraggableOpt } from './dd-draggable';
import { DDDroppable, DDDroppableOpt } from './dd-droppable';

export interface DDElementHost extends GridItemHTMLElement {
  ddElement?: DDElement;
}

export class DDElement {

  static init(el: DDElementHost): DDElement {
    if (!el.ddElement) { el.ddElement = new DDElement(el); }
    return el.ddElement;
  }

  public el: DDElementHost;
  public ddDraggable?: DDDraggable;
  public ddDroppable?: DDDroppable;
  public ddResizable?: DDResizable;

  constructor(el: DDElementHost) {
    this.el = el;
  }

  public on(eventName: string, callback: (event: MouseEvent) => void): DDElement {
    if (this.ddDraggable && ['drag', 'dragstart', 'dragstop'].indexOf(eventName) > -1) {
      this.ddDraggable.on(eventName as 'drag' | 'dragstart' | 'dragstop', callback);
    } else if (this.ddDroppable && ['drop', 'dropover', 'dropout'].indexOf(eventName) > -1) {
      this.ddDroppable.on(eventName as 'drop' | 'dropover' | 'dropout', callback);
    } else if (this.ddResizable && ['resizestart', 'resize', 'resizestop'].indexOf(eventName) > -1) {
      this.ddResizable.on(eventName as 'resizestart' | 'resize' | 'resizestop', callback);
    }
    return this;
  }

  public off(eventName: string): DDElement {
    if (this.ddDraggable && ['drag', 'dragstart', 'dragstop'].indexOf(eventName) > -1) {
      this.ddDraggable.off(eventName as 'drag' | 'dragstart' | 'dragstop');
    } else if (this.ddDroppable && ['drop', 'dropover', 'dropout'].indexOf(eventName) > -1) {
      this.ddDroppable.off(eventName as 'drop' | 'dropover' | 'dropout');
    } else if (this.ddResizable && ['resizestart', 'resize', 'resizestop'].indexOf(eventName) > -1) {
      this.ddResizable.off(eventName as 'resizestart' | 'resize' | 'resizestop');
    }
    return this;
  }

  public setupDraggable(opts: DDDraggableOpt): DDElement {
    if (!this.ddDraggable) {
      this.ddDraggable = new DDDraggable(this.el, opts);
    } else {
      this.ddDraggable.updateOption(opts);
    }
    return this;
  }

  public cleanDraggable(): DDElement {
    if (this.ddDraggable) {
      this.ddDraggable.destroy();
      delete this.ddDraggable;
    }
    return this;
  }

  public setupResizable(opts: DDResizableOpt): DDElement {
    if (!this.ddResizable) {
      this.ddResizable = new DDResizable(this.el, opts);
    } else {
      this.ddResizable.updateOption(opts);
    }
    return this;
  }

  public cleanResizable(): DDElement {
    if (this.ddResizable) {
      this.ddResizable.destroy();
      delete this.ddResizable;
    }
    return this;
  }

  public setupDroppable(opts: DDDroppableOpt): DDElement {
    if (!this.ddDroppable) {
      this.ddDroppable = new DDDroppable(this.el, opts);
    } else {
      this.ddDroppable.updateOption(opts);
    }
    return this;
  }

  public cleanDroppable(): DDElement {
    if (this.ddDroppable) {
      this.ddDroppable.destroy();
      delete this.ddDroppable;
    }
    return this;
  }
}
