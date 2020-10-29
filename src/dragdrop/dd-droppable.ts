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
  accept: (el: HTMLElement) => boolean;
  el: HTMLElement;
  option: DDDropableOpt;
  private acceptable: boolean = null;
  private style;
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
  }
  disable() {
    if (this.disabled) { return; }
    super.disable();
    this.el.classList.add('ui-droppable-disabled');
    this.el.removeEventListener('dragenter', this.dragEnter);
  }
  updateOption(opts) {
    Object.keys(opts).forEach(key => {
      const value = opts[key];
      this.option[key] = value;
    });
    this.setupAccept();
  }

  protected init() {
    this.el.classList.add('ui-droppable');
    this.el.addEventListener('dragenter', this.dragEnter);

    this.setupAccept();
    this.createStyleSheet();
  }

  protected dragEnter = (event: DragEvent) => {
    this.el.removeEventListener('dragenter', this.dragEnter);
    this.acceptable = this.canDrop();
    if (this.acceptable) {
      event.preventDefault();
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropover' });
      if (this.option.over) {
        this.option.over(ev, this.ui(DDManager.dragElement))
      }
      this.triggerEvent('dropover', ev);
      this.el.addEventListener('dragover', this.dragOver);
      this.el.addEventListener('drop', this.drop);
    }
    this.el.classList.add('ui-droppable-over');
    this.el.addEventListener('dragleave', this.dragLeave);

  }
  protected dragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }
  protected dragLeave = (event: DragEvent) => {
    if (this.el.contains(event.relatedTarget as HTMLElement)) { return; };
    this.el.removeEventListener('dragleave', this.dragLeave);
    this.el.classList.remove('ui-droppable-over');
    if (this.acceptable) {
      event.preventDefault();
      this.el.removeEventListener('dragover', this.dragOver);
      this.el.removeEventListener('drop', this.drop);
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropout' });
      if (this.option.out) {
        this.option.out(ev, this.ui(DDManager.dragElement))
      }
      this.triggerEvent('dropout', ev);
    }
    this.el.addEventListener('dragenter', this.dragEnter);
  }

  protected drop = (event: DragEvent) => {
    if (this.acceptable) {
      event.preventDefault();
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'drop' });
      if (this.option.drop) {
        this.option.drop(ev, this.ui(DDManager.dragElement))
      }
      this.triggerEvent('drop', ev);
      this.dragLeave({
        ...ev,
        relatedTarget: null,
        preventDefault: () => {
          // do nothing
        }
      });
    }
  }
  private canDrop() {
    return DDManager.dragElement && (!this.accept || this.accept(DDManager.dragElement.el));
  }
  private setupAccept() {
    if (this.option.accept && typeof this.option.accept === 'string') {
      this.accept = (el: HTMLElement) => {
        return el.matches(this.option.accept as string)
      }
    } else {
      this.accept = this.option.accept as ((el: HTMLElement) => boolean);
    }
  }

  private createStyleSheet() {
    const content = `.ui-droppable.ui-droppable-over > *:not(.ui-droppable) {pointer-events: none;}`;
    this.style = document.createElement('style');
    this.style.innerText = content;
    this.el.appendChild(this.style);
  }
  private removeStyleSheet() {
    this.el.removeChild(this.style);
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

