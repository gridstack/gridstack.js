/**
 * dd-droppable.ts 10.0.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDManager } from './dd-manager';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { Utils } from './utils';
import { DDElementHost } from './dd-element';
import { isTouch, pointerenter, pointerleave } from './dd-touch';
import { DDUIData } from './types';

export interface DDDroppableOpt {
  accept?: string | ((el: HTMLElement) => boolean);
  drop?: (event: DragEvent, ui: DDUIData) => void;
  over?: (event: DragEvent, ui: DDUIData) => void;
  out?: (event: DragEvent, ui: DDUIData) => void;
}

// let count = 0; // TEST

export class DDDroppable extends DDBaseImplement implements HTMLElementExtendOpt<DDDroppableOpt> {

  public accept: (el: HTMLElement) => boolean;
  public el: HTMLElement;
  public option: DDDroppableOpt;

  constructor(el: HTMLElement, opts: DDDroppableOpt = {}) {
    super();
    this.el = el;
    this.option = opts;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._mouseEnter = this._mouseEnter.bind(this);
    this._mouseLeave = this._mouseLeave.bind(this);
    this.enable();
    this._setupAccept();
  }

  public on(event: 'drop' | 'dropover' | 'dropout', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }

  public off(event: 'drop' | 'dropover' | 'dropout'): void {
    super.off(event);
  }

  public enable(): void {
    if (this.disabled === false) return;
    super.enable();
    this.el.classList.add('ui-droppable');
    this.el.classList.remove('ui-droppable-disabled');
    this.el.addEventListener('mouseenter', this._mouseEnter);
    this.el.addEventListener('mouseleave', this._mouseLeave);
    if (isTouch) {
      this.el.addEventListener('pointerenter', pointerenter);
      this.el.addEventListener('pointerleave', pointerleave);
    }
  }

  public disable(forDestroy = false): void {
    if (this.disabled === true) return;
    super.disable();
    this.el.classList.remove('ui-droppable');
    if (!forDestroy) this.el.classList.add('ui-droppable-disabled');
    this.el.removeEventListener('mouseenter', this._mouseEnter);
    this.el.removeEventListener('mouseleave', this._mouseLeave);
    if (isTouch) {
      this.el.removeEventListener('pointerenter', pointerenter);
      this.el.removeEventListener('pointerleave', pointerleave);
    }
  }

  public destroy(): void {
    this.disable(true);
    this.el.classList.remove('ui-droppable');
    this.el.classList.remove('ui-droppable-disabled');
    super.destroy();
  }

  public updateOption(opts: DDDroppableOpt): DDDroppable {
    Object.keys(opts).forEach(key => this.option[key] = opts[key]);
    this._setupAccept();
    return this;
  }

  /** @internal called when the cursor enters our area - prepare for a possible drop and track leaving */
  protected _mouseEnter(e: MouseEvent): void {
    // console.log(`${count++} Enter ${this.el.id || (this.el as GridHTMLElement).gridstack.opts.id}`); // TEST
    if (!DDManager.dragElement) return;
    if (!this._canDrop(DDManager.dragElement.el)) return;
    e.preventDefault();
    e.stopPropagation();

    // make sure when we enter this, that the last one gets a leave FIRST to correctly cleanup as we don't always do
    if (DDManager.dropElement && DDManager.dropElement !== this) {
      DDManager.dropElement._mouseLeave(e as DragEvent);
    }
    DDManager.dropElement = this;

    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dropover' });
    if (this.option.over) {
      this.option.over(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('dropover', ev);
    this.el.classList.add('ui-droppable-over');
    // console.log('tracking'); // TEST
  }

  /** @internal called when the item is leaving our area, stop tracking if we had moving item */
  protected _mouseLeave(e: MouseEvent): void {
    // console.log(`${count++} Leave ${this.el.id || (this.el as GridHTMLElement).gridstack.opts.id}`); // TEST
    if (!DDManager.dragElement || DDManager.dropElement !== this) return;
    e.preventDefault();
    e.stopPropagation();

    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dropout' });
    if (this.option.out) {
      this.option.out(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('dropout', ev);

    if (DDManager.dropElement === this) {
      delete DDManager.dropElement;
      // console.log('not tracking'); // TEST

      // if we're still over a parent droppable, send it an enter as we don't get one from leaving nested children
      let parentDrop: DDDroppable;
      let parent: DDElementHost = this.el.parentElement;
      while (!parentDrop && parent) {
        parentDrop = parent.ddElement?.ddDroppable;
        parent = parent.parentElement;
      }
      if (parentDrop) {
        parentDrop._mouseEnter(e);
      }
    }
  }

  /** item is being dropped on us - called by the drag mouseup handler - this calls the client drop event */
  public drop(e: MouseEvent): void {
    e.preventDefault();
    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'drop' });
    if (this.option.drop) {
      this.option.drop(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('drop', ev);
  }

  /** @internal true if element matches the string/method accept option */
  protected _canDrop(el: HTMLElement): boolean {
    return el && (!this.accept || this.accept(el));
  }

  /** @internal */
  protected _setupAccept(): DDDroppable {
    if (!this.option.accept) return this;
    if (typeof this.option.accept === 'string') {
      this.accept = (el: HTMLElement) => el.classList.contains(this.option.accept as string) || el.matches(this.option.accept as string);
    } else {
      this.accept = this.option.accept;
    }
    return this;
  }

  /** @internal */
  protected _ui(drag: DDDraggable): DDUIData {
    return {
      draggable: drag.el,
      ...drag.ui()
    };
  }
}

