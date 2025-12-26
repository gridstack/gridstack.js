/**
 * gridstack.component.ts 12.4.2
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import {
  AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input,
  OnDestroy, OnInit, Output, QueryList, Type, ViewChild, ViewContainerRef, reflectComponentType, ComponentRef
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { GridHTMLElement, GridItemHTMLElement, GridStack, GridStackNode, GridStackOptions, GridStackWidget } from 'gridstack';

import { NgGridStackNode, NgGridStackWidget } from './types';
import { BaseWidget } from './base-widget';
import { GridItemCompHTMLElement, GridstackItemComponent } from './gridstack-item.component';

/**
 * Event handler callback signatures for different GridStack events.
 * These types define the structure of data passed to Angular event emitters.
 */

/** Callback for general events (enable, disable, etc.) */
export type eventCB = {event: Event};

/** Callback for element-specific events (resize, drag, etc.) */
export type elementCB = {event: Event, el: GridItemHTMLElement};

/** Callback for events affecting multiple nodes (change, etc.) */
export type nodesCB = {event: Event, nodes: GridStackNode[]};

/** Callback for drop events with before/after node state */
export type droppedCB = {event: Event, previousNode: GridStackNode, newNode: GridStackNode};

/**
 * Extended HTMLElement interface for the grid container.
 * Stores a back-reference to the Angular component for integration purposes.
 */
export interface GridCompHTMLElement extends GridHTMLElement {
  /** Back-reference to the Angular GridStack component */
  _gridComp?: GridstackComponent;
}

/**
 * Mapping of selector strings to Angular component types.
 * Used for dynamic component creation based on widget selectors.
 */
export type SelectorToType = {[key: string]: Type<object>};

/**
 * Angular component wrapper for GridStack.
 *
 * This component provides Angular integration for GridStack grids, handling:
 * - Grid initialization and lifecycle
 * - Dynamic component creation and management
 * - Event binding and emission
 * - Integration with Angular change detection
 *
 * Use in combination with GridstackItemComponent for individual grid items.
 *
 * @example
 * ```html
 * <gridstack [options]="gridOptions" (change)="onGridChange($event)">
 *   <div empty-content>Drag widgets here</div>
 * </gridstack>
 * ```
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

  /**
   * List of template-based grid items (not recommended approach).
   * Used to sync between DOM and GridStack internals when items are defined in templates.
   * Prefer dynamic component creation instead.
   */
  @ContentChildren(GridstackItemComponent) public gridstackItems?: QueryList<GridstackItemComponent>;
  /**
   * Container for dynamic component creation (recommended approach).
   * Used to append grid items programmatically at runtime.
   */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;

  /**
   * Grid configuration options.
   * Can be set before grid initialization or updated after grid is created.
   *
   * @example
   * ```typescript
   * gridOptions: GridStackOptions = {
   *   column: 12,
   *   cellHeight: 'auto',
   *   animate: true
   * };
   * ```
   */
  @Input() public set options(o: GridStackOptions) {
    if (this._grid) {
      this._grid.updateOptions(o);
    } else {
      this._options = o;
    }
  }
  /** Get the current running grid options */
  public get options(): GridStackOptions { return this._grid?.opts || this._options || {}; }

  /**
   * Controls whether empty content should be displayed.
   * Set to true to show ng-content with 'empty-content' selector when grid has no items.
   *
   * @example
   * ```html
   * <gridstack [isEmpty]="gridItems.length === 0">
   *   <div empty-content>Drag widgets here to get started</div>
   * </gridstack>
   * ```
   */
  @Input() public isEmpty?: boolean;

  /**
   * GridStack event emitters for Angular integration.
   *
   * These provide Angular-style event handling for GridStack events.
   * Alternatively, use `this.grid.on('event1 event2', callback)` for multiple events.
   *
   * Note: 'CB' suffix prevents conflicts with native DOM events.
   *
   * @example
   * ```html
   * <gridstack (changeCB)="onGridChange($event)" (droppedCB)="onItemDropped($event)">
   * </gridstack>
   * ```
   */

  /** Emitted when widgets are added to the grid */
  @Output() public addedCB = new EventEmitter<nodesCB>();

  /** Emitted when grid layout changes */
  @Output() public changeCB = new EventEmitter<nodesCB>();

  /** Emitted when grid is disabled */
  @Output() public disableCB = new EventEmitter<eventCB>();

  /** Emitted during widget drag operations */
  @Output() public dragCB = new EventEmitter<elementCB>();

  /** Emitted when widget drag starts */
  @Output() public dragStartCB = new EventEmitter<elementCB>();

  /** Emitted when widget drag stops */
  @Output() public dragStopCB = new EventEmitter<elementCB>();

  /** Emitted when widget is dropped */
  @Output() public droppedCB = new EventEmitter<droppedCB>();

  /** Emitted when grid is enabled */
  @Output() public enableCB = new EventEmitter<eventCB>();

  /** Emitted when widgets are removed from the grid */
  @Output() public removedCB = new EventEmitter<nodesCB>();

  /** Emitted during widget resize operations */
  @Output() public resizeCB = new EventEmitter<elementCB>();

  /** Emitted when widget resize starts */
  @Output() public resizeStartCB = new EventEmitter<elementCB>();

  /** Emitted when widget resize stops */
  @Output() public resizeStopCB = new EventEmitter<elementCB>();

  /**
   * Get the native DOM element that contains grid-specific fields.
   * This element has GridStack properties attached to it.
   */
  public get el(): GridCompHTMLElement { return this.elementRef.nativeElement; }

  /**
   * Get the underlying GridStack instance.
   * Use this to access GridStack API methods directly.
   *
   * @example
   * ```typescript
   * this.gridComponent.grid.addWidget({x: 0, y: 0, w: 2, h: 1});
   * ```
   */
  public get grid(): GridStack | undefined { return this._grid; }

  /**
   * Component reference for dynamic component removal.
   * Used internally when this component is created dynamically.
   */
  public ref: ComponentRef<GridstackComponent> | undefined;

  /**
   * Mapping of component selectors to their types for dynamic creation.
   *
   * This enables dynamic component instantiation from string selectors.
   * Angular doesn't provide public access to this mapping, so we maintain our own.
   *
   * @example
   * ```typescript
   * GridstackComponent.addComponentToSelectorType([MyWidgetComponent]);
   * ```
   */
  public static selectorToType: SelectorToType = {};
  /**
   * Register a list of Angular components for dynamic creation.
   *
   * @param typeList Array of component types to register
   *
   * @example
   * ```typescript
   * GridstackComponent.addComponentToSelectorType([
   *   MyWidgetComponent,
   *   AnotherWidgetComponent
   * ]);
   * ```
   */
  public static addComponentToSelectorType(typeList: Array<Type<object>>) {
    typeList.forEach(type => GridstackComponent.selectorToType[ GridstackComponent.getSelector(type) ] = type);
  }
  /**
   * Extract the selector string from an Angular component type.
   *
   * @param type The component type to get selector from
   * @returns The component's selector string
   */
  public static getSelector(type: Type<object>): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    if (!GridStack.updateCB) {
      GridStack.updateCB = gsUpdateNgComponents;
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
    // nested grids don't have events in v12.1+ so skip
    if (grid.parentGridNode) return;
    grid
      .on('added', (event: Event, nodes: GridStackNode[]) => {
        const gridComp = (nodes[0].grid?.el as GridCompHTMLElement)._gridComp || this;
        gridComp.checkEmpty();
        this.addedCB.emit({event, nodes});
      })
      .on('change', (event: Event, nodes: GridStackNode[]) => this.changeCB.emit({event, nodes}))
      .on('disable', (event: Event) => this.disableCB.emit({event}))
      .on('drag', (event: Event, el: GridItemHTMLElement) => this.dragCB.emit({event, el}))
      .on('dragstart', (event: Event, el: GridItemHTMLElement) => this.dragStartCB.emit({event, el}))
      .on('dragstop', (event: Event, el: GridItemHTMLElement) => this.dragStopCB.emit({event, el}))
      .on('dropped', (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => this.droppedCB.emit({event, previousNode, newNode}))
      .on('enable', (event: Event) => this.enableCB.emit({event}))
      .on('removed', (event: Event, nodes: GridStackNode[]) => {
        const gridComp = (nodes[0].grid?.el as GridCompHTMLElement)._gridComp || this;
        gridComp.checkEmpty();
        this.removedCB.emit({event, nodes});
      })
      .on('resize', (event: Event, el: GridItemHTMLElement) => this.resizeCB.emit({event, el}))
      .on('resizestart', (event: Event, el: GridItemHTMLElement) => this.resizeStartCB.emit({event, el}))
      .on('resizestop', (event: Event, el: GridItemHTMLElement) => this.resizeStopCB.emit({event, el}))
  }

  protected unhookEvents(grid?: GridStack) {
    if (!grid) return;
    // nested grids don't have events in v12.1+ so skip
    if (grid.parentGridNode) return;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * track when widgeta re updated (rather than created) to make sure we de-serialize them as well
 */
export function gsUpdateNgComponents(n: NgGridStackNode) {
  const w: NgGridStackWidget = n;
  const gridItem = (n.el as GridItemCompHTMLElement)?._gridItemComp;
  if (gridItem?.childWidget && w.input) gridItem.childWidget.deserialize(w);
}