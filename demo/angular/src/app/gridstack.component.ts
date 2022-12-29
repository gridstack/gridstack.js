/**
 * gridstack.component.ts 7.1.2
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, EventEmitter, Input,
  NgZone, OnDestroy, OnInit, Output, QueryList } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridHTMLElement, GridItemHTMLElement, GridStack, GridStackNode, GridStackOptions, GridStackWidget } from 'gridstack';

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
export class GridstackComponent implements OnInit, AfterContentInit, OnDestroy {

  /** track list of grid items so we can sync between DOM and GS internals */
  @ContentChildren(GridstackItemComponent) public gridstackItems?: QueryList<GridstackItemComponent>;

  /** initial options for creation of the grid */
  @Input() public set options(val: GridStackOptions) { this._options = val; }
  /** return the current running options */
  public get options(): GridStackOptions { return this._grid?.opts || this._options || {}; }

  /** individual list of GridStackEvent callbacks handlers as output
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

  /** return the native element that contains grid specific fields as well */
  public get element(): GridHTMLElement { return this.elementRef.nativeElement; }

  /** return the GridStack class */
  public get grid(): GridStack | undefined { return this._grid; }

  private _options?: GridStackOptions;
  private _grid?: GridStack;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private readonly ngZone: NgZone,
    private readonly elementRef: ElementRef<GridHTMLElement>,
  ) {
  }

  public ngOnInit(): void {
    // init ourself before the children are created since we track them below anyway - no need to double create+update widgets
    this._grid = GridStack.init(this.options, this.element);
    delete this._options; // GS has it now
  }

  /** wait until after all DOM is ready to init gridstack children (after angular ngFor and sub-components run first) */
  public ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // whenever the children list changes, re-update the layout
      this.gridstackItems?.changes
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => this.updateAll());
      // and do this once at least...
      this.updateAll();
      this.hookEvents(this.grid);
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.grid?.destroy();
    delete this._grid;
  }

  /**
   * called when the list of items changes (or manually when you change content) - get a list of nodes and
   * update the layout accordingly (which will take care of adding/removing items changed by Angular)
   */
  public updateAll() {
    if (!this.grid) return;
    const layout: GridStackWidget[] = [];
    this.gridstackItems?.forEach(item => {
      layout.push(item.options);
      item.clearOptions();
    });
    this.grid.load(layout); // efficient that does diffs only
  }

  /** get all known events as easy to use Outputs for convenience */
  private hookEvents(grid?: GridStack) {
    if (!grid) return;
    grid.on('added', (event: Event, nodes: GridStackNode[]) => {
      this.ngZone.run(() => this.addedCB.emit({event, nodes}));
    });

    grid.on('change', (event: Event, nodes: GridStackNode[]) => {
      this.ngZone.run(() => this.changeCB.emit({event, nodes}));
    });

    grid.on('disable', (event: Event) => {
      this.ngZone.run(() => this.disableCB.emit({event}));
    });

    grid.on('drag', (event: Event, el: GridItemHTMLElement) => {
      this.ngZone.run(() => this.dragCB.emit({event, el}));
    });

    grid.on('dragstart', (event: Event, el: GridItemHTMLElement) => {
      this.ngZone.run(() => this.dragstartCB.emit({event, el}));
    });

    grid.on('dragstop', (event: Event, el: GridItemHTMLElement) => {
      this.ngZone.run(() => this.dragstopCB.emit({event, el}));
    });

    grid.on('dropped', (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => {
      this.ngZone.run(() => this.droppedCB.emit({event, previousNode, newNode}));
    });

    grid.on('enable', (event: Event) => {
      this.ngZone.run(() => this.enableCB.emit({event}));
    });

    grid.on('removed', (event: Event, nodes: GridStackNode[]) => {
      this.ngZone.run(() => this.removedCB.emit({event, nodes}));
    });

    grid.on('resize', (event: Event, el: GridItemHTMLElement) => {
      this.ngZone.run(() => this.resizeCB.emit({event, el}));
    });

    grid.on('resizestart', (event: Event, el: GridItemHTMLElement) => {
      this.ngZone.run(() => this.resizestartCB.emit({event, el}));
    });

    grid.on('resizestop', (event: Event, el: GridItemHTMLElement) => {
      this.ngZone.run(() => this.resizestopCB.emit({event, el}));
    });
  }
}
