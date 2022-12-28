import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import {GridstackItemComponent} from './gridstack-item.component';
import {merge, Subject} from 'rxjs';
import {GridStack, GridStackEvent, GridStackOptions} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import {map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'ef-gridstack',
  templateUrl: './gridstack.component.html',
  styleUrls: ['./gridstack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridstackComponent implements OnInit, OnDestroy {

  @ContentChildren(GridstackItemComponent) public gridstackItems: QueryList<GridstackItemComponent>;

  @Input() public options: GridStackOptions;

  @Output() public gridstackAdded = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackChange = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackDisable = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackDrag = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackDragStart = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackDragStop = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackDropped = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackEnable = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackRemoved = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackResize = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackResizeStart = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  @Output() public gridstackResizeStop = new EventEmitter<{
    event: GridStackEvent;
    grid: GridStack;
  }>();

  private readonly update$ = new Subject<void>();
  private readonly destroy$ = new Subject<boolean>();
  private _grid: GridStack;

  constructor(
    private readonly ngZone: NgZone,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer2: Renderer2,
  ) {
  }

  get grid(): GridStack {
    return this._grid;
  }

  public ngOnInit(): void {
    this.renderer2.addClass(this.elementRef.nativeElement, 'grid-stack');
  }

  public ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this._grid = GridStack.init(this.options, this.elementRef.nativeElement);
      this.hookEvents(this._grid);
      merge(
        this.update$,
        this.gridstackItems.changes,
      ).pipe(
        map(() => this.gridstackItems.toArray()),
        takeUntil(this.destroy$),
      ).subscribe(items => {
        const gridItems = this._grid.getGridItems();
        let elementsToRemove = [...gridItems];
        this._grid.batchUpdate();
        this._grid.column(this.options.column);
        for (const item of items) {
          const existingItem = gridItems.find(x => x.gridstackNode.id === item.identifier);
          if (existingItem) {
            elementsToRemove = elementsToRemove.filter(x => x.gridstackNode.id !== item.identifier);
            this._grid.update(existingItem, {
              h: item.height,
              w: item.width,
              x: item.x,
              y: item.y,
            });
          } else {
            this._grid.addWidget(item.elementRef.nativeElement, {
              id: item.identifier,
              h: item.height,
              w: item.width,
              x: item.x,
              y: item.y,
              minW: item.minW,
              minH: item.minH,
            });
          }
        }
        for (const gridItemHTMLElement of elementsToRemove) {
          this._grid.removeWidget(gridItemHTMLElement);
        }
        this._grid.commit();
      });
      this.update$.next();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.update$.complete();
    this._grid.destroy();
  }

  update() {
    this.update$.next();
  }

  private hookEvents(grid: GridStack) {
    grid.on('added', event => {
      this.ngZone.run(() => {
        this.gridstackAdded.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('disable', event => {
      this.ngZone.run(() => {
        this.gridstackDisable.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('enable', event => {
      this.ngZone.run(() => {
        this.gridstackEnable.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('removed', event => {
      this.ngZone.run(() => {
        this.gridstackRemoved.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('dropped', event => {
      this.ngZone.run(() => {
        this.gridstackDropped.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('resize', event => {
      this.ngZone.run(() => {
        this.gridstackResize.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('resizestart', event => {
      this.ngZone.run(() => {
        this.gridstackResizeStart.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('resizestop', event => {
      this.ngZone.run(() => {
        this.gridstackResizeStop.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('drag', event => {
      this.ngZone.run(() => {
        this.gridstackDrag.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('dragstart', event => {
      this.ngZone.run(() => {
        this.gridstackDragStart.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('dragstop', event => {
      this.ngZone.run(() => {
        this.gridstackDragStop.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });

    grid.on('change', event => {
      this.ngZone.run(() => {
        this.gridstackChange.emit({
          event: event as unknown as GridStackEvent,
          grid,
        });
      });
    });
  }

}
