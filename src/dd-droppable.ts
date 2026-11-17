/**
 * dd-droppable.ts 14.1.1
 * Copyright (c) 2021-2026 Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDManager } from './dd-manager';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { Utils } from './utils';
import { DDElementHost } from './dd-element';
import { DDUIData } from './types';

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

  /** @internal what the dragged item's shape is measured against (a sub-grid's whole cell, see DDDraggable._checkDropTarget) */
  public eventEl: HTMLElement;

  /** @internal droppable by its eventEl, so DDDraggable can find the ones under the dragged item */
  public static byEventEl = new WeakMap<HTMLElement, DDDroppable>();

  /**
   * @internal how much of the dragged item must be over a grid (or trash - any non-grid target) for it to go in, and to stay in.
   * A sub-grid takes more to go in than to stay (else we'd flip right back out to its parent grid), an outermost grid holds on
   * to it longer since nothing else would take it, while a trash lets go soon after (just enough not to flicker on its edge).
   */
  public static enterOver = { grid: 0.5, sub: 0.75, trash: 0.5 };
  public static stayOver = { grid: 0.25, sub: 0.5, trash: 0.4 };
  /** @internal how much more of the dragged item must be over a neighbor grid than the one it's in to switch to it */
  public static switchBy = 0.2;
  /** @internal edge of a hidden target (eg: collapsed sub-grid), as part of its smaller side, that puts us beside it */
  public static hiddenEdge = 0.25;

  constructor(public el: HTMLElement, public option: DDDroppableOpt = {}) {
    super();
    // For sub-grids the .grid-stack element is inset from the .grid-stack-item cell by the item
    // margins (--gs-item-margin-*), and only as tall as its rows, so measure the outer .grid-stack-item
    // instead so adjacent cells are gapless — moving from one sub-grid to a sibling never passes through dead space.
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
  }

  public override disable(forDestroy = false): void {
    if (this.disabled === true) return;
    super.disable();
    this.el.classList.remove('ui-droppable');
    if (!forDestroy) this.el.classList.add('ui-droppable-disabled');
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
   * @internal the dragged item came in (enough of it is over us, see DDDraggable._checkDropTarget - not the cursor, which depends
   * on where it was grabbed) - prepare for a possible drop
   */
  public _mouseEnter(e: MouseEvent): void {
    // console.log(`${count++} Enter ${this.el.id}`); // TEST
    if (!DDManager.dragElement) return;
    if (!this._canDrop(DDManager.dragElement.el)) return;
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

  /** @internal the dragged item went out (calledByEnter: into another target) */
  public _mouseLeave(e: MouseEvent, calledByEnter = false): void {
    // console.log(`${count++} Leave ${this.el.id}`); // TEST
    if (!DDManager.dragElement || DDManager.dropElement !== this) return;
    // stop the old grid's auto-scroll only when entering a new grid; if leaving to empty space keep scrolling until mouseup
    if (calledByEnter) DDManager.dragElement._stopScrolling();

    const ev = Utils.initEvent<DragEvent>(e, { target: this.el, type: 'dropout' });
    if (this.option.out) {
      this.option.out(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('dropout', ev);
    this.el.classList.remove('ui-droppable-over');

    if (DDManager.dropElement === this) {
      delete DDManager.dropElement;
      // console.log('not tracking'); // TEST
    }
  }

  /**
   * @internal how much (0-1) the two boxes overlap, each way by the smaller of their sides there - so a tall narrow item
   * spanning a short wide sub-grid's whole height is all over it (as much as can fit) rather than stuck at their height ratio.
   * Same as the part of the smaller box covered, when one box is no bigger than the other either way.
   */
  public static overlap(a: Box, b: Box): number {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    const sw = Math.min(a.width, b.width), sh = Math.min(a.height, b.height);
    return w > 0 && h > 0 && sw > 0 && sh > 0 ? (w / sw) * (h / sh) : 0;
  }

  /** @internal if a's center is inside b, away from its edges (see hiddenEdge) */
  public static inMiddle(a: Box, b: Box): boolean {
    const x = a.left + a.width / 2, y = a.top + a.height / 2, m = Math.min(b.width, b.height) * DDDroppable.hiddenEdge;
    return x > b.left + m && x < b.right - m && y > b.top + m && y < b.bottom - m;
  }

  /** @internal the closest droppable above us (the parent grid when we're a sub-grid) */
  public parentDroppable(): DDDroppable | undefined {
    for (let el = DDDroppable.parentOf(this.el); el; el = DDDroppable.parentOf(el)) {
      const parentDrop = (el as DDElementHost).ddElement?.ddDroppable;
      if (parentDrop) return parentDrop;
    }
    return undefined;
  }

  /** @internal true if we're the given droppable, or nested inside it */
  public within(drop?: DDDroppable): boolean {
    for (let el: Element | undefined = this.el; drop && el; el = DDDroppable.parentOf(el)) {
      if (el === drop.el) return true;
    }
    return false;
  }

  /** @internal the element above, stepping out of a shadow root to its host (a grid inside a web component) */
  public static parentOf(el: Element): Element | undefined {
    return el.parentElement || (el.getRootNode() as ShadowRoot).host;
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
