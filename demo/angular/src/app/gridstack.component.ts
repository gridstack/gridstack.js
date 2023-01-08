/**
 * gridstack.component.ts 7.1.2-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

import { AfterContentInit, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ContentChildren, ElementRef, EventEmitter, Input,
  NgZone, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AddRemoveFcn, GridHTMLElement, GridItemHTMLElement, GridStack, GridStackNode, GridStackOptions, GridStackWidget } from 'gridstack';

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
  template: `
    <!-- content to show when when grid is empty, like instructions on how to add widgets -->
    <ng-content select="[no-item-content]" *ngIf="showEmpty"></ng-content>
    <!-- where dynamic items go -->
    <ng-template #container></ng-template>
    <!-- where template items go -->
    <ng-content></ng-content>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridstackComponent implements OnInit, AfterContentInit, OnDestroy {

  /** track list of TEMPLATE grid items so we can sync between DOM and GS internals */
  @ContentChildren(GridstackItemComponent) public gridstackItems?: QueryList<GridstackItemComponent>;
  /** container to append items dynamically */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;

  /** initial options for creation of the grid */
  @Input() public set options(val: GridStackOptions) { this._options = val; }
  /** return the current running options */
  public get options(): GridStackOptions { return this._grid?.opts || this._options || {}; }

  /** true while ng-content with 'no-item-content' should be shown when last item is removed from a grid */
  @Input() public showEmpty?: boolean;

  /** individual list of GridStackEvent callbacks handlers as output
   * otherwise use this.grid.on('name1 name2 name3', callback) to handle multiple at once
   * see https://github.com/gridstack/gridstack.js/blob/master/demo/events.js#L4
   */
  @Output() public added = new EventEmitter<nodesCB>();
  @Output() public changeGS = new EventEmitter<nodesCB>(); // 'change' would trigger the raw CustomEvent so use different name
  @Output() public disable = new EventEmitter<eventCB>();
  @Output() public drag = new EventEmitter<elementCB>();
  @Output() public dragstart = new EventEmitter<elementCB>();
  @Output() public dragstop = new EventEmitter<elementCB>();
  @Output() public dropped = new EventEmitter<droppedCB>();
  @Output() public enable = new EventEmitter<eventCB>();
  @Output() public removed = new EventEmitter<nodesCB>();
  @Output() public resize = new EventEmitter<elementCB>();
  @Output() public resizestart = new EventEmitter<elementCB>();
  @Output() public resizestop = new EventEmitter<elementCB>();

  /** return the native element that contains grid specific fields as well */
  public get el(): GridHTMLElement { return this.elementRef.nativeElement; }

  /** return the GridStack class */
  public get grid(): GridStack | undefined { return this._grid; }

  private _options?: GridStackOptions;
  private _grid?: GridStack;
  private loaded?: boolean;
  private outsideAddRemove?: AddRemoveFcn;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    private readonly ngZone: NgZone,
    private readonly elementRef: ElementRef<GridHTMLElement>,
    private readonly resolver: ComponentFactoryResolver,
  ) {
  }

  public ngOnInit(): void {
    // inject our own addRemove so we can create GridItemComponent instead of simple divs
    const opts: GridStackOptions = this._options || {};
    if (opts.addRemoveCB) this.outsideAddRemove = opts.addRemoveCB;
    opts.addRemoveCB = this._addRemoveCB.bind(this);

    // init ourself before any template children are created since we track them below anyway - no need to double create+update widgets
    this.loaded = !!this.options?.children?.length;
    this._grid = GridStack.init(opts, this.el);
    delete this._options; // GS has it now
  }

  /** wait until after all DOM is ready to init gridstack children (after angular ngFor and sub-components run first) */
  public ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // track whenever the children list changes and update the layout...
      this.gridstackItems?.changes
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => this.updateAll());
      // ...and do this once at least unless we loaded children already
      if (!this.loaded) this.updateAll();
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
   * called when the TEMPLATE list of items changes - get a list of nodes and
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

  /** check if the grid is empty, if so show alternative content */
  public checkEmpty() {
    if (!this.grid) return;
    this.showEmpty = !this.grid.engine.nodes.length;
  }

  /** get all known events as easy to use Outputs for convenience */
  private hookEvents(grid?: GridStack) {
    if (!grid) return;
    grid
    .on('added', (event: Event, nodes: GridStackNode[]) => this.ngZone.run(() => {this.added.emit({event, nodes}); this.checkEmpty(); }))
    .on('change', (event: Event, nodes: GridStackNode[]) => this.ngZone.run(() => this.changeGS.emit({event, nodes})))
    .on('disable', (event: Event) => this.ngZone.run(() => this.disable.emit({event})))
    .on('drag', (event: Event, el: GridItemHTMLElement) => this.ngZone.run(() => this.drag.emit({event, el})))
    .on('dragstart', (event: Event, el: GridItemHTMLElement) => this.ngZone.run(() => this.dragstart.emit({event, el})))
    .on('dragstop', (event: Event, el: GridItemHTMLElement) => this.ngZone.run(() => this.dragstop.emit({event, el})))
    .on('dropped', (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => this.ngZone.run(() => this.dropped.emit({event, previousNode, newNode})))
    .on('enable', (event: Event) => this.ngZone.run(() => this.enable.emit({event})))
    .on('removed', (event: Event, nodes: GridStackNode[]) => this.ngZone.run(() => {this.removed.emit({event, nodes}); this.checkEmpty(); }))
    .on('resize', (event: Event, el: GridItemHTMLElement) => this.ngZone.run(() => this.resize.emit({event, el})))
    .on('resizestart', (event: Event, el: GridItemHTMLElement) => this.ngZone.run(() => this.resizestart.emit({event, el})))
    .on('resizestop', (event: Event, el: GridItemHTMLElement) => this.ngZone.run(() => this.resizestop.emit({event, el})))
  }

  /** called by GS when a new item needs to be created, which we do as a Angular component, or deleted (skip) */
  private _addRemoveCB(g: GridStack, w: GridStackWidget, add: boolean): HTMLElement | undefined {
    if (add) {
      if (!this.container) return;
      // create the grid item dynamically - see https://angular.io/docs/ts/latest/cookbook/dynamic-component-loader.html
      // and https://netbasal.com/dynamically-creating-components-with-angular-a7346f4a982d#.irxd1nulp
      const factory = this.resolver.resolveComponentFactory(GridstackItemComponent);
      const gridItem = this.container.createComponent(factory).instance;
      return gridItem.el;
    }
    // if (this.outsideAddRemove) this.outsideAddRemove(g, w, add);
    return;
  }
}
