/**
 * dd-droppable.ts 14.0.0
 * Copyright (c) 2021-2025  Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDManager } from './dd-manager';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { Utils } from './utils';
import { DDElementHost } from './dd-element';
import { DDTouch, isTouch, pointerenter, pointerleave } from './dd-touch';
import { DDUIData } from './types';
import type { GridHTMLElement } from './gridstack';

export interface DDDroppableOpt {
  accept?: string | ((el: HTMLElement) => boolean);
  drop?: (event: DragEvent, ui: DDUIData) => void;
  over?: (event: DragEvent, ui: DDUIData) => void;
  out?: (event: DragEvent, ui: DDUIData) => void;
}

/** @internal the part of a DOMRect we use for overlaps */
export type Box = Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>;

// let count = 0; // TEST

export class DDDroppable extends DDBaseImplement implements HTMLElementExtendOpt<DDDroppableOpt> {

  public accept!: (el: HTMLElement) => boolean;

  /** @internal element we track the cursor on (a sub-grid's whole cell), also what the item's shape is measured against */
  public eventEl: HTMLElement;

  /** @internal droppable by its eventEl, so DDDraggable can find the ones under the dragged item */
  public static byEventEl = new WeakMap<HTMLElement, DDDroppable>();

  /**
   * @internal how much of the dragged item must be over a grid for it to go in, and to stay in. A sub-grid takes more
   * to go in than to stay (else we'd flip right back out to its parent grid), while an outermost grid holds on to it
   * longer since nothing else would take it.
   */
  public static enterOver = { grid: 0.5, sub: 0.75 };
  public static stayOver = { grid: 0.25, sub: 0.5 };
  /** @internal how much more of the dragged item must be over a neighbor grid than the one it's in to switch to it */
  public static switchBy = 0.2;

  constructor(public el: HTMLElement, public option: DDDroppableOpt = {}) {
    super();
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._domEnter = this._domEnter.bind(this);
    this._domLeave = this._domLeave.bind(this);
    // For sub-grids the .grid-stack element is inset from the .grid-stack-item cell by the item
    // margins (--gs-item-margin-*).  Register on the outer .grid-stack-item instead so adjacent
    // cells are gapless — moving from one sub-grid to a sibling never passes through dead space.
    this.eventEl = (this.el.closest('.grid-stack-item') as HTMLElement) || this.el;
    DDDroppable.byEventEl.set(this.eventEl, this);
    this.enable();
    this._setupAccept();
  }

  public override on(event: 'drop' | 'dropover' | 'dropout', callback: (event: DragEvent) => void): void {
    super.on(event, callback as (event: Event) => void);
  }

  public override off(event: 'drop' | 'dropover' | 'dropout'): void {
    super.off(event);
  }

  public override enable(): void {
    if (this.disabled === false) return;
    super.enable();
    this.el.classList.add('ui-droppable');
    this.el.classList.remove('ui-droppable-disabled');
    this.eventEl.addEventListener('mouseenter', this._domEnter);
    this.eventEl.addEventListener('mouseleave', this._domLeave);
    if (isTouch) {
      this.eventEl.addEventListener('pointerenter', pointerenter);
      this.eventEl.addEventListener('pointerleave', pointerleave);
    }
  }

  public override disable(forDestroy = false): void {
    if (this.disabled === true) return;
    super.disable();
    this.el.classList.remove('ui-droppable');
    if (!forDestroy) this.el.classList.add('ui-droppable-disabled');
    this.eventEl.removeEventListener('mouseenter', this._domEnter);
    this.eventEl.removeEventListener('mouseleave', this._domLeave);
    if (isTouch) {
      this.eventEl.removeEventListener('pointerenter', pointerenter);
      this.eventEl.removeEventListener('pointerleave', pointerleave);
    }
  }

  public override destroy(): void {
    this.disable(true);
    this.el.classList.remove('ui-droppable');
    this.el.classList.remove('ui-droppable-disabled');
    if (DDDroppable.byEventEl.get(this.eventEl) === this) DDDroppable.byEventEl.delete(this.eventEl);
    super.destroy();
  }

  public updateOption(opts: DDDroppableOpt): DDDroppable {
    Object.assign(this.option, opts);
    this._setupAccept();
    return this;
  }

  /**
   * @internal the cursor came in or went out. Grids instead go by how much of the item is over them as it moves (see
   * DDDraggable._checkDropTarget) as the cursor depends on where the item was grabbed, so this is for other targets (a trash).
   */
  protected _domEnter(e: MouseEvent): void {
    if (!this._byShape()) this._mouseEnter(e);
  }
  protected _domLeave(e: MouseEvent): void {
    if (!this._byShape()) this._mouseLeave(e);
  }

  /**
   * @internal true if the dragged item's shape decides if we're its target rather than the cursor: we're a grid and it can
   * be measured (has a size, and we can find what's under it). Not for a temporary sub-grid (subGridDynamic) which is made
   * to receive it, so the cursor leaves.
   */
  public _byShape(): boolean {
    const grid = (this.el as GridHTMLElement).gridstack;
    if (!grid || grid._isTemp || !document.elementFromPoint) return false;
    const rect = DDManager.dragElement?.helper?.getBoundingClientRect();
    return !!(rect?.width && rect.height);
  }

  /** @internal called when the item enters our area - prepare for a possible drop and track leaving */
  public _mouseEnter(e: MouseEvent): void {
    // console.log(`${count++} Enter ${this.el.id}`); // TEST
    if (!DDManager.dragElement) return;
    // During touch drag operations, ignore real browser-generated mouseenter events (isTrusted:true) vs our simulated ones (isTrusted:false).
    // The browser can fire spurious mouseenter events when we dispatch simulated mousemove events.
    if (DDTouch.touchHandled && e.isTrusted) return

    if (!this._canDrop(DDManager.dragElement.el)) return;
    e.preventDefault();
    e.stopPropagation();
    DDManager.dragElement._stopScrolling();

    // make sure when we enter this, that the last one gets a leave FIRST to correctly cleanup as we don't always do
    if (DDManager.dropElement && DDManager.dropElement !== this) {
      DDManager.dropElement._mouseLeave(e as DragEvent, true); // calledByEnter = true
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

  /** @internal called when the item is leaving our area, stop tracking if we had moving item. toParent=false to not hand it to our parent */
  public _mouseLeave(e: MouseEvent, calledByEnter = false, toParent = true): void {
    // console.log(`${count++} Leave ${this.el.id}`); // TEST
    if (!DDManager.dragElement || DDManager.dropElement !== this) return;
    e.preventDefault();
    e.stopPropagation();
    // stop the old grid's auto-scroll only when entering a new grid; if leaving to empty space keep scrolling until mouseup
    if (calledByEnter) DDManager.dragElement._stopScrolling();

    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dropout' });
    if (this.option.out) {
      this.option.out(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('dropout', ev);

    if (DDManager.dropElement === this) {
      delete DDManager.dropElement;
      // console.log('not tracking'); // TEST

      // if we're still over a parent droppable, send it an enter as we don't get one from leaving nested children
      if (!calledByEnter && toParent) {
        this.parentDroppable()?._mouseEnter(e);
      }
    }
  }

  /** @internal fraction (0-1) of the smaller box that is covered by the intersection of the two */
  public static overlap(a: Box, b: Box): number {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    const area = Math.min(a.width * a.height, b.width * b.height);
    return w > 0 && h > 0 && area > 0 ? (w * h) / area : 0;
  }

  /** @internal the closest droppable above us (the parent grid when we're a sub-grid) */
  public parentDroppable(): DDDroppable | undefined {
    let parentDrop: DDDroppable | undefined;
    let parent: DDElementHost | null = this.el.parentElement;
    while (!parentDrop && parent) {
      parentDrop = parent.ddElement?.ddDroppable;
      parent = parent.parentElement as DDElementHost | null;
    }
    return parentDrop;
  }

  /** item is being dropped on us - called by the drag mouseup handler - this calls the client drop event */
  public drop(e: MouseEvent): void {
    e.preventDefault();
    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'drop' });
    if (this.option.drop) {
      this.option.drop(ev, this._ui(DDManager.dragElement!))
    }
    this.triggerEvent('drop', ev);
  }

  /** @internal true if element matches the string/method accept option */
  public _canDrop(el: HTMLElement): boolean {
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
