/**
 * gridstack-item.component.ts 7.1.2
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { GridItemHTMLElement, GridStackNode } from 'gridstack';

/**
 * HTML Component Wrapper for gridstack items, in combination with GridstackComponent for parent grid
 */
@Component({
  selector: 'gridstack-item',
  template: `
    <div class="grid-stack-item-content">
      <ng-content></ng-content>
    </div>`,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridstackItemComponent {

  /** list of options for creating/updating this item */
  @Input() public set options(val: GridStackNode) {
    if (this.element.gridstackNode?.grid) {
      // already built, do an update...
      this.element.gridstackNode.grid.update(this.element, val);
    } else {
      // store our custom element in options so we can update it and not re-create a generic div!
      val.el = this.element;
      this._options = val;
    }
  }
  /** return the latest grid options (from GS once built, otherwise initial values) */
  public get options(): GridStackNode {
    return this.element.gridstackNode || this._options || {};
  }

  private _options?: GridStackNode;

  /** return the native element that contains grid specific fields as well */
  public get element(): GridItemHTMLElement { return this.elementRef.nativeElement; }

  /** clears the initial options now that we've built */
  public clearOptions() {
    delete this._options;
  }

  constructor(private readonly elementRef: ElementRef<GridItemHTMLElement>) {
  }

  // none of those have parentElement set from which we could get the grid to auto-init ourself!
  // so we will let the parent track us instead...
  // ngOnInit() {
  //   this.element.parentElement
  // }
  // ngAfterContentInit() {
  // }
}
