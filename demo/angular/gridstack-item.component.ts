import {ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'ef-gridstack-item',
  templateUrl: './gridstack-item.component.html',
  styleUrls: ['./gridstack-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridstackItemComponent implements OnInit {

  @Input() public x: number;
  @Input() public y: number;
  @Input() public width: number;
  @Input() public height: number;
  @Input() public minW: number;
  @Input() public minH: number;
  @Input() public identifier: string;

  constructor(
    private readonly ngZone: NgZone,
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly renderer2: Renderer2,
  ) {
  }

  get elementRef(): ElementRef<HTMLElement> {
    return this._elementRef;
  }

  public ngOnInit(): void {
    this.renderer2.addClass(this._elementRef.nativeElement, 'grid-stack-item');
  }

}
