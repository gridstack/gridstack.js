/**
 * gridstack-item.component.ts 7.2.3
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
      {{options.content}}
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
    if (this.el.gridstackNode?.grid) {
      // already built, do an update...
      this.el.gridstackNode.grid.update(this.el, val);
    } else {
      // store our custom element in options so we can update it and not re-create a generic div!
      val.el = this.el;
      this._options = val;
    }
  }
  /** return the latest grid options (from GS once built, otherwise initial values) */
  public get options(): GridStackNode {
    return this.el.gridstackNode || this._options || {el: this.el};
  }

  private _options?: GridStackNode;

  /** return the native element that contains grid specific fields as well */
  public get el(): GridItemHTMLElement { return this.elementRef.nativeElement; }

  /** clears the initial options now that we've built */
  public clearOptions() {
    delete this._options;
  }

  constructor(private readonly elementRef: ElementRef<GridItemHTMLElement>) {
  }
}
