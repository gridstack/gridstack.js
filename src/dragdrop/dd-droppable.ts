// dd-droppable.ts 2.0.2-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 Alain Dumesny, rhlin
 * gridstack.js may be freely distributed under the MIT license.
*/
import { DDDraggble } from './dd-draggable';
import { DDManager } from './dd-manager';
import { DDBaseImplement, HTMLElementExtendOpt } from './dd-base-impl';
import { DDUtils } from './dd-utils';

export interface DDDropableOpt {
  accept?: string | ((el: HTMLElement) => boolean);
  drop?: (event: DragEvent, ui) => void;
  over?: (event: DragEvent, ui) => void;
  out?: (event: DragEvent, ui) => void;
};
export class DDDropable extends DDBaseImplement implements HTMLElementExtendOpt<DDDropableOpt> {
  el: HTMLElement;
  option: DDDropableOpt;
  private count = 0;
  private dragEl: HTMLElement;
  constructor(el: HTMLElement, opts: DDDropableOpt) {
    super();
    this.el = el;
    this.option = opts || {};
    this.init();
  }
  on(event: 'drop' | 'dropover' | 'dropout', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }
  off(event: 'drop' | 'dropover' | 'dropout') {
    super.off(event);
  }
  enable() {
    if (!this.disabled) { return; }
    super.enable();
    this.el.classList.remove('ui-droppable-disabled');
    this.el.addEventListener('dragenter', this.dragEnter);
    this.el.addEventListener('dragover', this.dragOver);
    this.el.addEventListener('drop', this.drop);
    this.el.addEventListener('dragleave', this.dragLeave);
  }
  disable() {
    if (this.disabled) { return; }
    super.disable();
    this.el.classList.add('ui-droppable-disabled');
    this.el.removeEventListener('dragenter', this.dragEnter);
    this.el.removeEventListener('dragover', this.dragOver);
    this.el.removeEventListener('drop', this.drop);
    this.el.removeEventListener('dragleave', this.dragLeave);
  }
  updateOption(opts) {
    Object.keys(opts).forEach(key => {
      const value = opts[key];
      this.option[key] = value;
    });
  }

  protected init() {
    this.el.classList.add('ui-droppable');
    this.el.addEventListener('dragenter', this.dragEnter);
    this.el.addEventListener('dragover', this.dragOver);
    this.el.addEventListener('drop', this.drop);
    this.el.addEventListener('dragleave', this.dragLeave);
  }

  protected dragEnter = (event: DragEvent) => {
    if (this.canDrop()) {
      if (0 === this.count) {
        this.dragEl = DDManager.dragElement.el;
        this.dragEl.addEventListener('dragend', this.resetCount);
        const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropover' });
        if (this.option.over) {
          this.option.over(ev, this.ui(DDManager.dragElement))
        }
        this.triggerEvent('dropover', ev);
        event.preventDefault();
      }
    }
    this.count++;
  }
  protected dragOver = (event: DragEvent) => {
    if (this.canDrop()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  protected dragLeave = (event: DragEvent) => {
    this.count--;
    if (this.canDrop()) {
      if (0 === this.count) {
        const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropout' });
        if (this.option.out) {
          this.option.out(ev, this.ui(DDManager.dragElement))
        }
        this.triggerEvent('dropout', ev);
      }
      event.preventDefault();
    }
  }
  protected drop = (event: DragEvent) => {
    if (this.canDrop()) {
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'drop' });
      if (this.option.drop) {
        this.option.drop(ev, this.ui(DDManager.dragElement))
      }
      this.triggerEvent('drop', ev);
      event.preventDefault();
      this.count = 0;
    }
  }
  private resetCount = () => {
    this.count = 0;
    this.dragEl.removeEventListener('dragend', this.resetCount);
    this.dragEl = undefined;
  }
  private canDrop() {
    let accept;
    if (this.option.accept && typeof this.option.accept === 'string') {
      accept = (el: HTMLElement) => {
        return el.matches(this.option.accept as string)
      }
    } else {
      accept = this.option.accept as ((el: HTMLElement) => boolean);
    }
    return DDManager.dragElement && (!accept || accept(DDManager.dragElement.el));
  }

  destroy() {
    this.el.classList.remove('ui-droppable');
    if (this.disabled) {
      this.el.classList.remove('ui-droppable-disabled');
      this.el.removeEventListener('dragenter', this.dragEnter);
      this.el.removeEventListener('dragover', this.dragOver);
      this.el.removeEventListener('drop', this.drop);
      this.el.removeEventListener('dragleave', this.dragLeave);
    }
    super.destroy();
  }

  ui(ddDraggble: DDDraggble) {
    return {
      draggable: ddDraggble.el,
      ...ddDraggble.ui()
    };
  }
}

