/**
 * gridstack.component.ts 8.0.0-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input,
  OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewContainerRef, reflectComponentType } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridHTMLElement, GridItemHTMLElement, GridStack, GridStackNode, GridStackOptions, GridStackWidget } from 'gridstack';

import { GridItemCompHTMLElement, GridstackItemComponent } from './gridstack-item.component';

/** events handlers emitters signature for different events */
export type eventCB = {event: Event};
export type elementCB = {event: Event, el: GridItemHTMLElement};
export type nodesCB = {event: Event, nodes: GridStackNode[]};
export type droppedCB = {event: Event, previousNode: GridStackNode, newNode: GridStackNode};

/** extends to store Ng Component selector, instead/inAddition to content */
export interface NgGridStackWidget extends GridStackWidget {
  type?: string; // component type to create as content
}
export interface NgGridStackNode extends GridStackNode {
  type?: string; // component type to create as content
}
export interface NgGridStackOptions extends GridStackOptions {
  children?: NgGridStackWidget[];
  subGridOpts?: NgGridStackOptions;
}

/** store element to Ng Class pointer back */
export interface GridCompHTMLElement extends GridHTMLElement {
  _gridComp?: GridstackComponent;
}

/** selector string to runtime Type mapping */
export type SelectorToType = {[key: string]: Type<Object>};

/**
 * HTML Component Wrapper for gridstack, in combination with GridstackItemComponent for the items
 */
@Component({
  selector: 'gridstack',
  template: `
    <!-- content to show when when grid is empty, like instructions on how to add widgets -->
    <ng-content select="[empty-content]" *ngIf="isEmpty"></ng-content>
    <!-- where dynamic items go -->
    <ng-template #container></ng-template>
    <!-- where template items go -->
    <ng-content></ng-content>
  `,
  styles: [`
    :host { display: block; }
  `],
  // changeDetection: ChangeDetectionStrategy.OnPush, // IFF you want to optimize and control when ChangeDetection needs to happen...
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
  @Input() public isEmpty?: boolean;

  /** individual list of GridStackEvent callbacks handlers as output
   * otherwise use this.grid.on('name1 name2 name3', callback) to handle multiple at once
   * see https://github.com/gridstack/gridstack.js/blob/master/demo/events.js#L4
   *
   * Note: camel casing and 'CB' added at the end to prevent @angular-eslint/no-output-native
   * eg: 'change' would trigger the raw CustomEvent so use different name.
   */
  @Output() public addedCB = new EventEmitter<nodesCB>();
  @Output() public changeCB = new EventEmitter<nodesCB>();
  @Output() public disableCB = new EventEmitter<eventCB>();
  @Output() public dragCB = new EventEmitter<elementCB>();
  @Output() public dragStartCB = new EventEmitter<elementCB>();
  @Output() public dragStopCB = new EventEmitter<elementCB>();
  @Output() public droppedCB = new EventEmitter<droppedCB>();
  @Output() public enableCB = new EventEmitter<eventCB>();
  @Output() public removedCB = new EventEmitter<nodesCB>();
  @Output() public resizeCB = new EventEmitter<elementCB>();
  @Output() public resizeStartCB = new EventEmitter<elementCB>();
  @Output() public resizeStopCB = new EventEmitter<elementCB>();

  /** return the native element that contains grid specific fields as well */
  public get el(): GridCompHTMLElement { return this.elementRef.nativeElement; }

  /** return the GridStack class */
  public get grid(): GridStack | undefined { return this._grid; }

  /**
   * stores the selector -> Type mapping, so we can create items dynamically from a string.
   * Unfortunately Ng doesn't provide public access to that mapping.
   */
  public static selectorToType: SelectorToType = {};
  /** add a list of ng Component to be mapped to selector */
  public static addComponentToSelectorType(typeList: Array<Type<Object>>) {
    typeList.forEach(type => GridstackComponent.selectorToType[ GridstackComponent.getSelector(type) ] = type);
  }
  /** return the ng Component selector */
  public static getSelector(type: Type<Object>): string {
    const mirror = reflectComponentType(type)!;
    return mirror.selector;
  }

  private _options?: GridStackOptions;
  private _grid?: GridStack;
  private loaded?: boolean;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(
    // private readonly zone: NgZone,
    // private readonly cd: ChangeDetectorRef,
    private readonly elementRef: ElementRef<GridCompHTMLElement>,
  ) {
    this.el._gridComp = this;
  }

  public ngOnInit(): void {
    // init ourself before any template children are created since we track them below anyway - no need to double create+update widgets
    this.loaded = !!this.options?.children?.length;
    this._grid = GridStack.init(this._options, this.el);
    delete this._options; // GS has it now

    this.checkEmpty();
  }

  /** wait until after all DOM is ready to init gridstack children (after angular ngFor and sub-components run first) */
  public ngAfterContentInit(): void {
    // track whenever the children list changes and update the layout...
    this.gridstackItems?.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.updateAll());
    // ...and do this once at least unless we loaded children already
    if (!this.loaded) this.updateAll();
    this.hookEvents(this.grid);
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.grid?.destroy();
    delete this._grid;
    delete this.el._gridComp;
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
    const isEmpty = !this.grid.engine.nodes.length;
    if (isEmpty === this.isEmpty) return;
    this.isEmpty = isEmpty;
    // this.cd.detectChanges();
  }

  /** get all known events as easy to use Outputs for convenience */
  private hookEvents(grid?: GridStack) {
    if (!grid) return;
    grid
    .on('added', (event: Event, nodes: GridStackNode[]) => { this.checkEmpty(); this.addedCB.emit({event, nodes}); })
    .on('change', (event: Event, nodes: GridStackNode[]) => this.changeCB.emit({event, nodes}))
    .on('disable', (event: Event) => this.disableCB.emit({event}))
    .on('drag', (event: Event, el: GridItemHTMLElement) => this.dragCB.emit({event, el}))
    .on('dragstart', (event: Event, el: GridItemHTMLElement) => this.dragStartCB.emit({event, el}))
    .on('dragstop', (event: Event, el: GridItemHTMLElement) => this.dragStopCB.emit({event, el}))
    .on('dropped', (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => this.droppedCB.emit({event, previousNode, newNode}))
    .on('enable', (event: Event) => this.enableCB.emit({event}))
    .on('removed', (event: Event, nodes: GridStackNode[]) => { this.checkEmpty(); this.removedCB.emit({event, nodes}); })
    .on('resize', (event: Event, el: GridItemHTMLElement) => this.resizeCB.emit({event, el}))
    .on('resizestart', (event: Event, el: GridItemHTMLElement) => this.resizeStartCB.emit({event, el}))
    .on('resizestop', (event: Event, el: GridItemHTMLElement) => this.resizeStopCB.emit({event, el}))
  }
}

/**
 * can be used when a new item needs to be created, which we do as a Angular component, or deleted (skip)
 **/
export function gsCreateNgComponents(host: GridCompHTMLElement | HTMLElement, w: NgGridStackWidget | GridStackOptions, add: boolean, isGrid: boolean): HTMLElement | undefined {
  // only care about creating ng components here...
  if (!add || !host) return;

  // create the component dynamically - see https://angular.io/docs/ts/latest/cookbook/dynamic-component-loader.html
  if (isGrid) {
    let grid: GridstackComponent | undefined;
    const gridItemComp = (host.parentElement as GridItemCompHTMLElement)?._gridItemComp;
    if (gridItemComp) {
      grid = gridItemComp.container?.createComponent(GridstackComponent)?.instance;
    } else {
      // TODO: figure out how to create ng component inside regular Div. need to access app injectors...
      // const hostElement: Element = host;
      // const environmentInjector: EnvironmentInjector;
      // grid = createComponent(GridstackComponent, {environmentInjector, hostElement})?.instance;
    }
    if (grid) grid.options = w as GridStackOptions;
    return grid?.el;
  } else {
    const gridComp = (host as GridCompHTMLElement)._gridComp;
    const gridItem = gridComp?.container?.createComponent(GridstackItemComponent)?.instance;

    // IFF we're not a subGrid, define what type of component to create as child, OR you can do it GridstackItemComponent template, but this is more generic
    const selector = (w as NgGridStackWidget).type;
    const type = selector ? GridstackComponent.selectorToType[selector] : undefined;
    if (!w.subGridOpts && type) {
      gridItem?.container?.createComponent(type);
    }

    return gridItem?.el;
  }
}

/**
 * can be used when saving the grid - make sure we save the content from the field (not HTML as we get ng markups)
 * and can put the extra info of type, otherwise content
 */
export function gsSaveAdditionalNgInfo(n: NgGridStackNode, w: NgGridStackWidget) {
  if (n.type) w.type = n.type;
  else if (n.content) w.content = n.content;
}
