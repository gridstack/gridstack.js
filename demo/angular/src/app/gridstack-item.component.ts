import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import { GridItemHTMLElement, numberOrString } from 'gridstack';

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
export class GridstackItemComponent implements OnInit {

  @Input() public x: number;
  @Input() public y: number;
  @Input() public w: number;
  @Input() public h: number;
  @Input() public minW: number;
  @Input() public minH: number;
  @Input() public maxW: number;
  @Input() public maxH: number;
  @Input() public id: numberOrString;

  constructor(
    private readonly _elementRef: ElementRef<GridItemHTMLElement>,
    private readonly renderer2: Renderer2,
  ) {
  }

  get elementRef(): ElementRef<GridItemHTMLElement> {
    return this._elementRef;
  }

  public ngOnInit(): void {
    this.renderer2.addClass(this._elementRef.nativeElement, 'grid-stack-item');
  }
}
