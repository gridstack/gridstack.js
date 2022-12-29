import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { GridItemHTMLElement, GridStackNode } from 'gridstack';

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

  /** list of options for creating this item */
  @Input() public set options(val: GridStackNode) {
    val.el = this.element; // connect this element to options so we can convert to widget later
    if (this.element.gridstackNode?.grid) {
      this.element.gridstackNode.grid.update(this.element, val);
    } else {
      this._options = val; // store initial values (before we're built)
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
