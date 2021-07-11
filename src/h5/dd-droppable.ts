/**
 * dd-droppable.ts 4.2.6
 * Copyright (c) 2021 Alain Dumesny - see GridStack root license
 */

import { DDDraggable } from './dd-draggable';
import { DDManager } from './dd-manager';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { DDUtils } from './dd-utils';

export interface DDDroppableOpt {
  accept?: string | ((el: HTMLElement) => boolean);
  drop?: (event: DragEvent, ui) => void;
  over?: (event: DragEvent, ui) => void;
  out?: (event: DragEvent, ui) => void;
}

export class DDDroppable extends DDBaseImplement implements HTMLElementExtendOpt<DDDroppableOpt> {

  public accept: (el: HTMLElement) => boolean;
  public el: HTMLElement;
  public option: DDDroppableOpt;

  /** @internal */
  private moving: boolean;

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
    if (this.moving) {
      this._removeLeaveCallbacks();
    } 
    this.disable(true);
    this.el.classList.remove('ui-droppable');
    this.el.classList.remove('ui-droppable-disabled');
    delete this.moving;
    super.destroy();
  }

  public updateOption(opts: DDDroppableOpt): DDDroppable {
    Object.keys(opts).forEach(key => this.option[key] = opts[key]);
    this._setupAccept();
    return this;
  }

  /** @internal called when the cursor enters our area - prepare for a possible drop and track leaving */
  private _dragEnter(event: DragEvent): void {
    if (!this._canDrop()) return;
    event.preventDefault();

    if (this.moving) return; // ignore multiple 'dragenter' as we go over existing items
    this.moving = true;

    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropover' });
    if (this.option.over) {
      this.option.over(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('dropover', ev);
    this.el.addEventListener('dragover', this._dragOver);
    this.el.addEventListener('drop', this._drop);
    this.el.addEventListener('dragleave', this._dragLeave);
    this.el.classList.add('ui-droppable-over');
  }

  /** @internal called when an moving to drop item is being dragged over - do nothing but eat the event */
  private _dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /** @internal called when the item is leaving our area, stop tracking if we had moving item */
  private _dragLeave(event: DragEvent): void {

    // ignore leave events on our children (get when starting to drag our items)
    // Note: Safari Mac has null relatedTarget which causes #1684 so check if DragEvent is inside the grid instead
    if (!event.relatedTarget) {
      const { bottom, left, right, top } = this.el.getBoundingClientRect();
      if (event.x < right && event.x > left && event.y < bottom && event.y > top) return;
    } else if (this.el.contains(event.relatedTarget as HTMLElement)) return;

    this._removeLeaveCallbacks();
    if (this.moving) {
      event.preventDefault();
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropout' });
      if (this.option.out) {
        this.option.out(ev, this._ui(DDManager.dragElement))
      }
      this.triggerEvent('dropout', ev);
    }
    delete this.moving;
  }

  /** @internal item is being dropped on us - call the client drop event */
  private _drop(event: DragEvent): void {
    if (!this.moving) return; // should not have received event...
    event.preventDefault();
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'drop' });
    if (this.option.drop) {
      this.option.drop(ev, this._ui(DDManager.dragElement))
    }
    this.triggerEvent('drop', ev);
    this._removeLeaveCallbacks();
    delete this.moving;
  }

  /** @internal called to remove callbacks when leaving or dropping */
  private _removeLeaveCallbacks() {
    this.el.removeEventListener('dragleave', this._dragLeave);
    this.el.classList.remove('ui-droppable-over');
    if (this.moving) {
      this.el.removeEventListener('dragover', this._dragOver);
      this.el.removeEventListener('drop', this._drop);
    }
    // Note: this.moving is reset by callee of this routine to control the flow
  }

  /** @internal */
  private _canDrop(): boolean {
    return DDManager.dragElement && (!this.accept || this.accept(DDManager.dragElement.el));
  }

  /** @internal */
  private _setupAccept(): DDDroppable {
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
  private _ui(drag: DDDraggable) {
    return {
      draggable: drag.el,
      ...drag.ui()
    };
  }
}

