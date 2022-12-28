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
import { merge, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GridHTMLElement, GridItemHTMLElement, GridStack, GridStackNode, GridStackOptions } from 'gridstack';

import { GridstackItemComponent } from './gridstack-item.component';

/** events handlers emitters signature for different events */
export type eventCB = {event: Event};
export type elementCB = {event: Event, el: GridItemHTMLElement};
export type nodesCB = {event: Event, nodes: GridStackNode[]};
export type droppedCB = {event: Event, previousNode: GridStackNode, newNode: GridStackNode};

/**
 * HTML Component Wrapper for gridstack, in combination with GridstackItemComponent for the items
 */
@Component({
  selector: 'gridstack',
  template: '',
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridstackComponent implements OnInit, OnDestroy {

  /** track list of grid items so we can sync between DOM and GS internals */
  @ContentChildren(GridstackItemComponent) public gridstackItems: QueryList<GridstackItemComponent>;

  @Input() public options: GridStackOptions;

  /** individual list of all GridStackEvent callbacks handlers as output
   * otherwise use this.grid.on('name1 name2 name3', callback) to handle multiple at once
   * see https://github.com/gridstack/gridstack.js/blob/master/demo/events.js#L4
   */
  @Output() public addedCB = new EventEmitter<nodesCB>();
  @Output() public changeCB = new EventEmitter<nodesCB>();
  @Output() public disableCB = new EventEmitter<eventCB>();
  @Output() public dragCB = new EventEmitter<elementCB>();
  @Output() public dragstartCB = new EventEmitter<elementCB>();
  @Output() public dragstopCB = new EventEmitter<elementCB>();
  @Output() public droppedCB = new EventEmitter<droppedCB>();
  @Output() public enableCB = new EventEmitter<eventCB>();
  @Output() public removedCB = new EventEmitter<nodesCB>();
  @Output() public resizeCB = new EventEmitter<elementCB>();
  @Output() public resizestartCB = new EventEmitter<elementCB>();
  @Output() public resizestopCB = new EventEmitter<elementCB>();

  public grid: GridStack;
  private readonly update$ = new Subject<void>();
  private readonly destroy$ = new Subject<boolean>();

  constructor(
    private readonly ngZone: NgZone,
    private readonly elementRef: ElementRef<GridHTMLElement>,
    private readonly renderer2: Renderer2,
  ) {
  }

  public ngOnInit(): void {
    this.renderer2.addClass(this.elementRef.nativeElement, 'grid-stack');
  }

  // wait until after DOM is ready to init gridstack - can't be ngOnInit() as angular ngFor or sub-components needs to run first!
  public ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // initialize the grid with given options
      this.grid = GridStack.init(this.options, this.elementRef.nativeElement);
      this.hookEvents(this.grid);

      merge(
        this.update$,
        this.gridstackItems.changes,
      ).pipe(
        map(() => this.gridstackItems.toArray()),
        takeUntil(this.destroy$),
      ).subscribe(items => {
        const gridItems = this.grid.getGridItems();
        let elementsToRemove = [...gridItems];
        this.grid.batchUpdate();
        // this.grid.column(this.options.column);
        for (const item of items) {
          const existingItem = gridItems.find(x => x.gridstackNode?.id === item.id);
          if (existingItem) {
            elementsToRemove = elementsToRemove.filter(x => x.gridstackNode?.id !== item.id);
            this.grid.update(existingItem, {
              h: item.h,
              w: item.w,
              x: item.x,
              y: item.y,
            });
          } else {
            this.grid.addWidget(item.elementRef.nativeElement, {
              id: item.id,
              h: item.h,
              w: item.w,
              x: item.x,
              y: item.y,
              minW: item.minW,
              minH: item.minH,
            });
          }
        }
        for (const gridItemHTMLElement of elementsToRemove) {
          this.grid.removeWidget(gridItemHTMLElement);
        }
        this.grid.commit();
      });

      this.update$.next();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.update$.complete();
    this.grid.destroy();
  }

  public update() {
    this.update$.next();
  }

  private hookEvents(grid: GridStack) {
    grid.on('added', (event, nodes) => {
      this.ngZone.run(() => this.addedCB.emit({event, nodes: nodes as GridStackNode[]}));
    });

    grid.on('change', (event, nodes) => {
      this.ngZone.run(() => this.changeCB.emit({event, nodes: nodes as GridStackNode[]}));
    });

    grid.on('disable', (event) => {
      this.ngZone.run(() => this.disableCB.emit({event}));
    });

    grid.on('drag', (event, el) => {
      this.ngZone.run(() => this.dragCB.emit({event, el: el as GridItemHTMLElement}));
    });

    grid.on('dragstart', (event, el) => {
      this.ngZone.run(() => this.dragstartCB.emit({event, el: el as GridItemHTMLElement}));
    });

    grid.on('dragstop', (event, el) => {
      this.ngZone.run(() => this.dragstopCB.emit({event, el: el as GridItemHTMLElement}));
    });

    grid.on('dropped', (event, previousNode, newNode) => {
      this.ngZone.run(() =>
        this.droppedCB.emit({
          event,
          previousNode: previousNode as GridStackNode,
          newNode: newNode as GridStackNode,
        })
      )
    });

    grid.on('enable', (event) => {
      this.ngZone.run(() => this.enableCB.emit({event}));
    });

    grid.on('removed', (event, nodes) => {
      this.ngZone.run(() => this.removedCB.emit({event, nodes: nodes as GridStackNode[]}));
    });

    grid.on('resize', (event, el) => {
      this.ngZone.run(() => this.resizeCB.emit({event, el: el as GridItemHTMLElement}));
    });

    grid.on('resizestart', (event, el) => {
      this.ngZone.run(() => this.resizestartCB.emit({event, el: el as GridItemHTMLElement}));
    });

    grid.on('resizestop', (event, el) => {
      this.ngZone.run(() => this.resizestopCB.emit({event, el: el as GridItemHTMLElement}));
    });
  }
}
