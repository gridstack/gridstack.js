/**
 * gridstack.component.ts 12.0.0-dev
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input,
  OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewContainerRef, reflectComponentType, ComponentRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { GridHTMLElement, GridItemHTMLElement, GridStack, GridStackNode, GridStackOptions, GridStackWidget } from 'gridstack';

import { NgGridStackNode, NgGridStackWidget } from './types';
import { BaseWidget } from './base-widget';
import { GridItemCompHTMLElement, GridstackItemComponent } from './gridstack-item.component';

/** events handlers emitters signature for different events */
export type eventCB = {event: Event};
export type elementCB = {event: Event, el: GridItemHTMLElement};
export type nodesCB = {event: Event, nodes: GridStackNode[]};
export type droppedCB = {event: Event, previousNode: GridStackNode, newNode: GridStackNode};

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
  standalone: true,
  imports: [NgIf]
  // changeDetection: ChangeDetectionStrategy.OnPush, // IFF you want to optimize and control when ChangeDetection needs to happen...
})
export class GridstackComponent implements OnInit, AfterContentInit, OnDestroy {

  /** track list of TEMPLATE (not recommended) grid items so we can sync between DOM and GS internals */
  @ContentChildren(GridstackItemComponent) public gridstackItems?: QueryList<GridstackItemComponent>;
  /** container to append items dynamically (recommended way) */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;

  /** initial options for creation of the grid */
  @Input() public set options(o: GridStackOptions) {
    if (this._grid) {
      this._grid.updateOptions(o);
    } else {
      this._options = o;
    }
  }
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

  /** ComponentRef of ourself - used by dynamic object to correctly get removed */
  public ref: ComponentRef<GridstackComponent> | undefined;

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
    return reflectComponentType(type)!.selector;
  }

  protected _options?: GridStackOptions;
  protected _grid?: GridStack;
  protected _sub: Subscription | undefined;
  protected loaded?: boolean;

  constructor(protected readonly elementRef: ElementRef<GridCompHTMLElement>) {
    // set globally our method to create the right widget type
    if (!GridStack.addRemoveCB) {
      GridStack.addRemoveCB = gsCreateNgComponents;
    }
    if (!GridStack.saveCB) {
      GridStack.saveCB = gsSaveAdditionalNgInfo;
    }
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
    this._sub = this.gridstackItems?.changes.subscribe(() => this.updateAll());
    // ...and do this once at least unless we loaded children already
    if (!this.loaded) this.updateAll();
    this.hookEvents(this.grid);
  }

  public ngOnDestroy(): void {
    this.unhookEvents(this._grid);
    this._sub?.unsubscribe();
    this._grid?.destroy();
    delete this._grid;
    delete this.el._gridComp;
    delete this.container;
    delete this.ref;
  }

  /**
   * called when the TEMPLATE (not recommended) list of items changes - get a list of nodes and
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
    this.isEmpty = !this.grid.engine.nodes.length;
  }

  /** get all known events as easy to use Outputs for convenience */
  protected hookEvents(grid?: GridStack) {
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

  protected unhookEvents(grid?: GridStack) {
    if (!grid) return;
    grid.off('added change disable drag dragstart dragstop dropped enable removed resize resizestart resizestop');
  }
}

/**
 * can be used when a new item needs to be created, which we do as a Angular component, or deleted (skip)
 **/
export function gsCreateNgComponents(host: GridCompHTMLElement | HTMLElement, n: NgGridStackNode, add: boolean, isGrid: boolean): HTMLElement | undefined {
  if (add) {
    //
    // create the component dynamically - see https://angular.io/docs/ts/latest/cookbook/dynamic-component-loader.html
    //
    if (!host) return;
    if (isGrid) {
      // TODO: figure out how to create ng component inside regular Div. need to access app injectors...
      // if (!container) {
      //   const hostElement: Element = host;
      //   const environmentInjector: EnvironmentInjector;
      //   grid = createComponent(GridstackComponent, {environmentInjector, hostElement})?.instance;
      // }

      const gridItemComp = (host.parentElement as GridItemCompHTMLElement)?._gridItemComp;
      if (!gridItemComp) return;
      // check if gridItem has a child component with 'container' exposed to create under..
      const container = (gridItemComp.childWidget as any)?.container || gridItemComp.container;
      const gridRef = container?.createComponent(GridstackComponent);
      const grid = gridRef?.instance;
      if (!grid) return;
      grid.ref = gridRef;
      grid.options = n;
      return grid.el;
    } else {
      const gridComp = (host as GridCompHTMLElement)._gridComp;
      const gridItemRef = gridComp?.container?.createComponent(GridstackItemComponent);
      const gridItem = gridItemRef?.instance;
      if (!gridItem) return;
      gridItem.ref = gridItemRef

      // define what type of component to create as child, OR you can do it GridstackItemComponent template, but this is more generic
      const selector = n.selector;
      const type = selector ? GridstackComponent.selectorToType[selector] : undefined;
      if (type) {
        // shared code to create our selector component
        const createComp = () => {
          const childWidget = gridItem.container?.createComponent(type)?.instance as BaseWidget;
          // if proper BaseWidget subclass, save it and load additional data
          if (childWidget && typeof childWidget.serialize === 'function' && typeof childWidget.deserialize === 'function') {
            gridItem.childWidget = childWidget;
            childWidget.deserialize(n);
          }
        }

        const lazyLoad = n.lazyLoad || n.grid?.opts?.lazyLoad && n.lazyLoad !== false;
        if (lazyLoad) {
          if (!n.visibleObservable) {
            n.visibleObservable = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) {
              n.visibleObservable?.disconnect();
              delete n.visibleObservable;
              createComp();
            }});
            window.setTimeout(() => n.visibleObservable?.observe(gridItem.el)); // wait until callee sets position attributes
          }
        } else createComp();
      }

      return gridItem.el;
    }
  } else {
    //
    // REMOVE - have to call ComponentRef:destroy() for dynamic objects to correctly remove themselves
    // Note: this will destroy all children dynamic components as well: gridItem -> childWidget
    //
    if (isGrid) {
      const grid = (n.el as GridCompHTMLElement)?._gridComp;
      if (grid?.ref) grid.ref.destroy();
      else grid?.ngOnDestroy();
    } else {
      const gridItem = (n.el as GridItemCompHTMLElement)?._gridItemComp;
      if (gridItem?.ref) gridItem.ref.destroy();
      else gridItem?.ngOnDestroy();
    }
  }
  return;
}

/**
 * called for each item in the grid - check if additional information needs to be saved.
 * Note: since this is options minus gridstack protected members using Utils.removeInternalForSave(),
 * this typically doesn't need to do anything. However your custom Component @Input() are now supported
 * using BaseWidget.serialize()
 */
export function gsSaveAdditionalNgInfo(n: NgGridStackNode, w: NgGridStackWidget) {
  const gridItem = (n.el as GridItemCompHTMLElement)?._gridItemComp;
  if (gridItem) {
    const input = gridItem.childWidget?.serialize();
    if (input) {
      w.input = input;
    }
    return;
  }
  // else check if Grid
  const grid = (n.el as GridCompHTMLElement)?._gridComp;
  if (grid) {
    //.... save any custom data
  }
}
