// dd-droppable.ts 2.2.0-dev @preserve

/**
 * https://gridstackjs.com/
 * (c) 2020 rhlin, Alain Dumesny
 * gridstack.js may be freely distributed under the MIT license.
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
  private acceptable: boolean = null;

  constructor(el: HTMLElement, opts: DDDroppableOpt = {}) {
    super();
    this.el = el;
    this.option = opts;
    // create var event binding so we can easily remove and still look like TS methods (unlike anonymous functions)
    this.dragEnter = this.dragEnter.bind(this);
    this.dragOver = this.dragOver.bind(this);
    this.dragLeave = this.dragLeave.bind(this);
    this.drop = this.drop.bind(this);

    this.init();
  }

  public on(event: 'drop' | 'dropover' | 'dropout', callback: (event: DragEvent) => void): void {
    super.on(event, callback);
  }

  public off(event: 'drop' | 'dropover' | 'dropout'): void {
    super.off(event);
  }

  public enable(): void {
    if (!this.disabled) { return; }
    super.enable();
    this.el.classList.remove('ui-droppable-disabled');
    this.el.addEventListener('dragenter', this.dragEnter);
  }

  public disable(): void {
    if (this.disabled) { return; }
    super.disable();
    this.el.classList.add('ui-droppable-disabled');
    this.el.removeEventListener('dragenter', this.dragEnter);
  }

  public destroy(): void {
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

  public updateOption(opts: DDDroppableOpt): DDDroppable {
    Object.keys(opts).forEach(key => this.option[key] = opts[key]);
    this.setupAccept();
    return this;
  }

  protected init(): DDDroppable {
    this.el.classList.add('ui-droppable');
    this.el.addEventListener('dragenter', this.dragEnter);
    this.setupAccept();
    return this;
  }

  /** called when the cursor enters our area - prepare for a possible drop and track leaving */
  protected dragEnter(event: DragEvent): void {
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

  /** called when an acceptable to drop item is being dragged over - do nothing but eat the event */
  private dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /** called when the item is leaving our area, stop tracking if we had acceptable item */
  private dragLeave(event: DragEvent): void {
    if (this.el.contains(event.relatedTarget as HTMLElement)) { return; }
    this.removeLeaveCallbacks();
    if (this.acceptable) {
      event.preventDefault();
      const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'dropout' });
      if (this.option.out) {
        this.option.out(ev, this.ui(DDManager.dragElement))
      }
      this.triggerEvent('dropout', ev);
    }
  }

  /** item is being dropped on us - call the client drop event */
  private drop(event: DragEvent): void {
    if (!this.acceptable) { return; } // should not have received event...
    event.preventDefault();
    const ev = DDUtils.initEvent<DragEvent>(event, { target: this.el, type: 'drop' });
    if (this.option.drop) {
      this.option.drop(ev, this.ui(DDManager.dragElement))
    }
    this.triggerEvent('drop', ev);
    this.removeLeaveCallbacks();
  }

  /** called to remove callbacks when leaving or dropping */
  private removeLeaveCallbacks() {
    this.el.removeEventListener('dragleave', this.dragLeave);
    this.el.classList.remove('ui-droppable-over');
    if (this.acceptable) {
      this.el.removeEventListener('dragover', this.dragOver);
      this.el.removeEventListener('drop', this.drop);
    }
    this.el.addEventListener('dragenter', this.dragEnter);
  }

  private canDrop(): boolean {
    return DDManager.dragElement && (!this.accept || this.accept(DDManager.dragElement.el));
  }

  private setupAccept(): DDDroppable {
    if (this.option.accept && typeof this.option.accept === 'string') {
      this.accept = (el: HTMLElement) => {
        return el.matches(this.option.accept as string)
      }
    } else {
      this.accept = this.option.accept as ((el: HTMLElement) => boolean);
    }
    return this;
  }

  private ui(drag: DDDraggable) {
    return {
      draggable: drag.el,
      ...drag.ui()
    };
  }
}

