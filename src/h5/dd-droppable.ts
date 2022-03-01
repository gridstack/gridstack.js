/**
 * dd-droppable.ts 5.0.0-dev
 * Copyright (c) 2021-2022 Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDManager } from './dd-manager';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { DDUtils } from './dd-utils';
import { GridHTMLElement, GridStack } from '../gridstack';
import { GridItemHTMLElement } from '../types';

export interface DDDroppableOpt {
  accept?: string | ((el: HTMLElement) => boolean);
  drop?: (event: DragEvent, ui) => void;
  over?: (event: DragEvent, ui) => void;
  out?: (event: DragEvent, ui) => void;
}

// TEST let count = 0;

export class DDDroppable extends DDBaseImplement implements HTMLElementExtendOpt<DDDroppableOpt> {

  public accept: (el: HTMLElement) => boolean;
  public el: HTMLElement;
  public option: DDDroppableOpt;

  /** @internal */
  protected moving: boolean;
  protected static lastActive: DDDroppable;

  constructor(el: HTMLElement, opts: DDDroppableOpt = {}) {
    super();
    this.el = el;
    this.option = opts;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this._dragEnter = this._dragEnter.bind(this);
    this._dragOver = this._dragOver.bind(this);
    this._dragLeave = this._dragLeave.bind(this);
    this._drop = this._drop.bind(this);

    this.el.classList.add('ui-droppable');
    this.el.addEventListener('dragenter', this._dragEnter);
    this._setupAccept();
  }

  public on(event: 'drop' | 'dropover' | 'dropout', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }

  public off(event: 'drop' | 'dropover' | 'dropout'): void {
    super.off(event);
  }

  public enable(): void {
    if (!this.disabled) return;
    super.enable();
    this.el.classList.remove('ui-droppable-disabled');
    this.el.addEventListener('dragenter', this._dragEnter);
  }

  public disable(forDestroy=false): void {
    if (this.disabled) return;
    super.disable();
    if (!forDestroy) this.el.classList.add('ui-droppable-disabled');
    this.el.removeEventListener('dragenter', this._dragEnter);
  }

  public destroy(): void {
    this._removeLeaveCallbacks();
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
  protected _dragEnter(event: DragEvent): void {
    // TEST console.log(`${count++} Enter ${(this.el as GridHTMLElement).gridstack.opts.id}`);
    if (!this._canDrop()) return;
    event.preventDefault();
    event.stopPropagation();

    // ignore multiple 'dragenter' as we go over existing items
    if (this.moving) return;
    this.moving = true;

    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropover' });
    if (this.option.over) {
      this.option.over(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('dropover', ev);
    this.el.addEventListener('dragover', this._dragOver);
    this.el.addEventListener('drop', this._drop);
    this.el.addEventListener('dragleave', this._dragLeave);
    // Update: removed that as it causes nested grids to no receive dragenter events when parent drags and sets this for #992. not seeing cursor flicker (chrome).
    // this.el.classList.add('ui-droppable-over');

    // make sure when we enter this, that the last one gets a leave to correctly cleanup as we don't always do
    if (DDDroppable.lastActive && DDDroppable.lastActive !== this) {
      DDDroppable.lastActive._dragLeave(event, true);
    }
    DDDroppable.lastActive = this;
  }

  /** @internal called when an moving to drop item is being dragged over - do nothing but eat the event */
  protected _dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /** @internal called when the item is leaving our area, stop tracking if we had moving item */
  protected _dragLeave(event: DragEvent, forceLeave?: boolean): void {
    // TEST console.log(`${count++} Leave ${(this.el as GridHTMLElement).gridstack.opts.id}`);
    event.preventDefault();
    event.stopPropagation();

    // ignore leave events on our children (we get them when starting to drag our items)
    // but exclude nested grids since we would still be leaving ourself, 
    // but don't handle leave if we're dragging a nested grid around
    if (!forceLeave) {
      let onChild = DDUtils.inside(event, this.el);
      let drag: GridItemHTMLElement = DDManager.dragElement.el;
      if (onChild && !drag.gridstackNode?.subGrid) { // dragging a nested grid ?
        let nestedEl = (this.el as GridHTMLElement).gridstack.engine.nodes.filter(n => n.subGrid).map(n => (n.subGrid as GridStack).el);
        onChild = !nestedEl.some(el => DDUtils.inside(event, el));
      }
      if (onChild) return;
    }

    if (this.moving) {
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropout' });
      if (this.option.out) {
        this.option.out(ev, this._ui(DDManager.dragElement))
      }
      this.triggerEvent('dropout', ev);
    }
    this._removeLeaveCallbacks();

    if (DDDroppable.lastActive === this) {
      delete DDDroppable.lastActive;
    }
  }

  /** @internal item is being dropped on us - call the client drop event */
  protected _drop(event: DragEvent): void {
    if (!this.moving) return; // should not have received event...
    event.preventDefault();
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'drop' });
    if (this.option.drop) {
      this.option.drop(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('drop', ev);
    this._removeLeaveCallbacks();
  }

  /** @internal called to remove callbacks when leaving or dropping */
  protected _removeLeaveCallbacks() {
    if (!this.moving) { return; }
    delete this.moving;
    this.el.removeEventListener('dragover', this._dragOver);
    this.el.removeEventListener('drop', this._drop);
    this.el.removeEventListener('dragleave', this._dragLeave);
    // Update: removed that as it causes nested grids to no receive dragenter events when parent drags and sets this for #992. not seeing cursor flicker (chrome).
    // this.el.classList.remove('ui-droppable-over');
  }

  /** @internal */
  protected _canDrop(): boolean {
    return DDManager.dragElement && (!this.accept || this.accept(DDManager.dragElement.el));
  }

  /** @internal */
  protected _setupAccept(): DDDroppable {
    if (this.option.accept && typeof this.option.accept === 'string') {
      this.accept = (el: HTMLElement) => {
        return el.matches(this.option.accept as string)
      }
    } else {
      this.accept = this.option.accept as ((el: HTMLElement) => boolean);
    }
    return this;
  }

  /** @internal */
  protected _ui(drag: DDDraggable) {
    return {
      draggable: drag.el,
      ...drag.ui()
    };
  }
}

