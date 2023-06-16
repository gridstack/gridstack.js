/**
 * gridstack.component.ts 8.3.0-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */
import { Component, ContentChildren, EventEmitter, Input, Output, ViewChild, ViewContainerRef, reflectComponentType } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridStack } from 'gridstack';
import { GridstackItemComponent } from './gridstack-item.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * HTML Component Wrapper for gridstack, in combination with GridstackItemComponent for the items
 */
export class GridstackComponent {
    constructor(
    // private readonly zone: NgZone,
    // private readonly cd: ChangeDetectorRef,
    elementRef) {
        this.elementRef = elementRef;
        /** individual list of GridStackEvent callbacks handlers as output
         * otherwise use this.grid.on('name1 name2 name3', callback) to handle multiple at once
         * see https://github.com/gridstack/gridstack.js/blob/master/demo/events.js#L4
         *
         * Note: camel casing and 'CB' added at the end to prevent @angular-eslint/no-output-native
         * eg: 'change' would trigger the raw CustomEvent so use different name.
         */
        this.addedCB = new EventEmitter();
        this.changeCB = new EventEmitter();
        this.disableCB = new EventEmitter();
        this.dragCB = new EventEmitter();
        this.dragStartCB = new EventEmitter();
        this.dragStopCB = new EventEmitter();
        this.droppedCB = new EventEmitter();
        this.enableCB = new EventEmitter();
        this.removedCB = new EventEmitter();
        this.resizeCB = new EventEmitter();
        this.resizeStartCB = new EventEmitter();
        this.resizeStopCB = new EventEmitter();
        this.ngUnsubscribe = new Subject();
        this.el._gridComp = this;
    }
    /** initial options for creation of the grid */
    set options(val) { this._options = val; }
    /** return the current running options */
    get options() { return this._grid?.opts || this._options || {}; }
    /** return the native element that contains grid specific fields as well */
    get el() { return this.elementRef.nativeElement; }
    /** return the GridStack class */
    get grid() { return this._grid; }
    /** add a list of ng Component to be mapped to selector */
    static addComponentToSelectorType(typeList) {
        typeList.forEach(type => GridstackComponent.selectorToType[GridstackComponent.getSelector(type)] = type);
    }
    /** return the ng Component selector */
    static getSelector(type) {
        return reflectComponentType(type).selector;
    }
    ngOnInit() {
        // init ourself before any template children are created since we track them below anyway - no need to double create+update widgets
        this.loaded = !!this.options?.children?.length;
        this._grid = GridStack.init(this._options, this.el);
        delete this._options; // GS has it now
        this.checkEmpty();
    }
    /** wait until after all DOM is ready to init gridstack children (after angular ngFor and sub-components run first) */
    ngAfterContentInit() {
        // track whenever the children list changes and update the layout...
        this.gridstackItems?.changes
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.updateAll());
        // ...and do this once at least unless we loaded children already
        if (!this.loaded)
            this.updateAll();
        this.hookEvents(this.grid);
    }
    ngOnDestroy() {
        delete this.ref;
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
    updateAll() {
        if (!this.grid)
            return;
        const layout = [];
        this.gridstackItems?.forEach(item => {
            layout.push(item.options);
            item.clearOptions();
        });
        this.grid.load(layout); // efficient that does diffs only
    }
    /** check if the grid is empty, if so show alternative content */
    checkEmpty() {
        if (!this.grid)
            return;
        const isEmpty = !this.grid.engine.nodes.length;
        if (isEmpty === this.isEmpty)
            return;
        this.isEmpty = isEmpty;
        // this.cd.detectChanges();
    }
    /** get all known events as easy to use Outputs for convenience */
    hookEvents(grid) {
        if (!grid)
            return;
        grid
            .on('added', (event, nodes) => { this.checkEmpty(); this.addedCB.emit({ event, nodes }); })
            .on('change', (event, nodes) => this.changeCB.emit({ event, nodes }))
            .on('disable', (event) => this.disableCB.emit({ event }))
            .on('drag', (event, el) => this.dragCB.emit({ event, el }))
            .on('dragstart', (event, el) => this.dragStartCB.emit({ event, el }))
            .on('dragstop', (event, el) => this.dragStopCB.emit({ event, el }))
            .on('dropped', (event, previousNode, newNode) => this.droppedCB.emit({ event, previousNode, newNode }))
            .on('enable', (event) => this.enableCB.emit({ event }))
            .on('removed', (event, nodes) => { this.checkEmpty(); this.removedCB.emit({ event, nodes }); })
            .on('resize', (event, el) => this.resizeCB.emit({ event, el }))
            .on('resizestart', (event, el) => this.resizeStartCB.emit({ event, el }))
            .on('resizestop', (event, el) => this.resizeStopCB.emit({ event, el }));
    }
}
/**
 * stores the selector -> Type mapping, so we can create items dynamically from a string.
 * Unfortunately Ng doesn't provide public access to that mapping.
 */
GridstackComponent.selectorToType = {};
GridstackComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
GridstackComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: GridstackComponent, selector: "gridstack", inputs: { options: "options", isEmpty: "isEmpty" }, outputs: { addedCB: "addedCB", changeCB: "changeCB", disableCB: "disableCB", dragCB: "dragCB", dragStartCB: "dragStartCB", dragStopCB: "dragStopCB", droppedCB: "droppedCB", enableCB: "enableCB", removedCB: "removedCB", resizeCB: "resizeCB", resizeStartCB: "resizeStartCB", resizeStopCB: "resizeStopCB" }, queries: [{ propertyName: "gridstackItems", predicate: GridstackItemComponent }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: `
    <!-- content to show when when grid is empty, like instructions on how to add widgets -->
    <ng-content select="[empty-content]" *ngIf="isEmpty"></ng-content>
    <!-- where dynamic items go -->
    <ng-template #container></ng-template>
    <!-- where template items go -->
    <ng-content></ng-content>
  `, isInline: true, styles: [":host{display:block}\n"], dependencies: [{ kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gridstack', template: `
    <!-- content to show when when grid is empty, like instructions on how to add widgets -->
    <ng-content select="[empty-content]" *ngIf="isEmpty"></ng-content>
    <!-- where dynamic items go -->
    <ng-template #container></ng-template>
    <!-- where template items go -->
    <ng-content></ng-content>
  `, styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { gridstackItems: [{
                type: ContentChildren,
                args: [GridstackItemComponent]
            }], container: [{
                type: ViewChild,
                args: ['container', { read: ViewContainerRef, static: true }]
            }], options: [{
                type: Input
            }], isEmpty: [{
                type: Input
            }], addedCB: [{
                type: Output
            }], changeCB: [{
                type: Output
            }], disableCB: [{
                type: Output
            }], dragCB: [{
                type: Output
            }], dragStartCB: [{
                type: Output
            }], dragStopCB: [{
                type: Output
            }], droppedCB: [{
                type: Output
            }], enableCB: [{
                type: Output
            }], removedCB: [{
                type: Output
            }], resizeCB: [{
                type: Output
            }], resizeStartCB: [{
                type: Output
            }], resizeStopCB: [{
                type: Output
            }] } });
/**
 * can be used when a new item needs to be created, which we do as a Angular component, or deleted (skip)
 **/
export function gsCreateNgComponents(host, w, add, isGrid) {
    if (add) {
        //
        // create the component dynamically - see https://angular.io/docs/ts/latest/cookbook/dynamic-component-loader.html
        //
        if (!host)
            return;
        if (isGrid) {
            const container = host.parentElement?._gridItemComp?.container;
            // TODO: figure out how to create ng component inside regular Div. need to access app injectors...
            // if (!container) {
            //   const hostElement: Element = host;
            //   const environmentInjector: EnvironmentInjector;
            //   grid = createComponent(GridstackComponent, {environmentInjector, hostElement})?.instance;
            // }
            const gridRef = container?.createComponent(GridstackComponent);
            const grid = gridRef?.instance;
            if (!grid)
                return;
            grid.ref = gridRef;
            grid.options = w;
            return grid.el;
        }
        else {
            const gridComp = host._gridComp;
            const gridItemRef = gridComp?.container?.createComponent(GridstackItemComponent);
            const gridItem = gridItemRef?.instance;
            if (!gridItem)
                return;
            gridItem.ref = gridItemRef;
            // IFF we're not a subGrid, define what type of component to create as child, OR you can do it GridstackItemComponent template, but this is more generic
            const selector = w.selector;
            const type = selector ? GridstackComponent.selectorToType[selector] : undefined;
            if (!w.subGridOpts && type) {
                const childWidget = gridItem.container?.createComponent(type)?.instance;
                if (typeof childWidget?.serialize === 'function' && typeof childWidget?.deserialize === 'function') {
                    // proper BaseWidget subclass, save it and load additional data
                    gridItem.childWidget = childWidget;
                    childWidget.deserialize(w);
                }
            }
            return gridItem.el;
        }
    }
    else {
        //
        // REMOVE - have to call ComponentRef:destroy() for dynamic objects to correctly remove themselves
        // Note: this will destroy all children dynamic components as well: gridItem -> childWidget
        //
        const n = w;
        if (isGrid) {
            const grid = n.el?._gridComp;
            if (grid?.ref)
                grid.ref.destroy();
            else
                grid?.ngOnDestroy();
        }
        else {
            const gridItem = n.el?._gridItemComp;
            if (gridItem?.ref)
                gridItem.ref.destroy();
            else
                gridItem?.ngOnDestroy();
        }
    }
    return;
}
/**
 * called for each item in the grid - check if additional information needs to be saved.
 * Note: since this is options minus gridstack private members using Utils.removeInternalForSave(),
 * this typically doesn't need to do anything. However your custom Component @Input() are now supported
 * using BaseWidget.serialize()
 */
export function gsSaveAdditionalNgInfo(n, w) {
    const gridItem = n.el?._gridItemComp;
    if (gridItem) {
        const input = gridItem.childWidget?.serialize();
        if (input) {
            w.input = input;
        }
        return;
    }
    // else check if Grid
    const grid = n.el?._gridComp;
    if (grid) {
        //.... save any custom data
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0YWNrLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FuZ3VsYXIvcHJvamVjdHMvbGliL3NyYy9saWIvZ3JpZHN0YWNrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQW9CLFNBQVMsRUFBRSxlQUFlLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFDakUsTUFBTSxFQUFtQixTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBQ3JJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBd0MsU0FBUyxFQUFvRCxNQUFNLFdBQVcsQ0FBQztBQUU5SCxPQUFPLEVBQTJCLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7OztBQWdDN0Y7O0dBRUc7QUFnQkgsTUFBTSxPQUFPLGtCQUFrQjtJQStEN0I7SUFDRSxpQ0FBaUM7SUFDakMsMENBQTBDO0lBQ3pCLFVBQTJDO1FBQTNDLGVBQVUsR0FBVixVQUFVLENBQWlDO1FBbkQ5RDs7Ozs7O1dBTUc7UUFDYyxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN0QyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN2QyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUN4QyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztRQUN2QyxnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFhLENBQUM7UUFDNUMsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFhLENBQUM7UUFDM0MsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFhLENBQUM7UUFDMUMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDdkMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDeEMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFhLENBQUM7UUFDekMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBYSxDQUFDO1FBQzlDLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQWEsQ0FBQztRQTRCdEQsa0JBQWEsR0FBa0IsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQU9uRCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQTlERCwrQ0FBK0M7SUFDL0MsSUFBb0IsT0FBTyxDQUFDLEdBQXFCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNFLHlDQUF5QztJQUN6QyxJQUFXLE9BQU8sS0FBdUIsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUF5QjFGLDJFQUEyRTtJQUMzRSxJQUFXLEVBQUUsS0FBMEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFFOUUsaUNBQWlDO0lBQ2pDLElBQVcsSUFBSSxLQUE0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBVS9ELDBEQUEwRDtJQUNuRCxNQUFNLENBQUMsMEJBQTBCLENBQUMsUUFBNkI7UUFDcEUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBRSxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUM3RyxDQUFDO0lBQ0QsdUNBQXVDO0lBQ2hDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBa0I7UUFDMUMsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLENBQUUsQ0FBQyxRQUFRLENBQUM7SUFDOUMsQ0FBQztJQWVNLFFBQVE7UUFDYixtSUFBbUk7UUFDbkksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDO1FBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0I7UUFFdEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxzSEFBc0g7SUFDL0csa0JBQWtCO1FBQ3ZCLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU87YUFDekIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbkMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLGlFQUFpRTtRQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU07WUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxTQUFTO1FBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUN2QixNQUFNLE1BQU0sR0FBc0IsRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsaUNBQWlDO0lBQzNELENBQUM7SUFFRCxpRUFBaUU7SUFDMUQsVUFBVTtRQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtZQUFFLE9BQU87UUFDdkIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQy9DLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QiwyQkFBMkI7SUFDN0IsQ0FBQztJQUVELGtFQUFrRTtJQUMxRCxVQUFVLENBQUMsSUFBZ0I7UUFDakMsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPO1FBQ2xCLElBQUk7YUFDSCxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBWSxFQUFFLEtBQXNCLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEgsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQVksRUFBRSxLQUFzQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO2FBQzFGLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQzthQUM3RCxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBWSxFQUFFLEVBQXVCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7YUFDcEYsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQVksRUFBRSxFQUF1QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO2FBQzlGLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFZLEVBQUUsRUFBdUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQzthQUM1RixFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBWSxFQUFFLFlBQTJCLEVBQUUsT0FBc0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7YUFDekksRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO2FBQzNELEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxLQUFZLEVBQUUsS0FBc0IsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwSCxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBWSxFQUFFLEVBQXVCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7YUFDeEYsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLEtBQVksRUFBRSxFQUF1QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDO2FBQ2xHLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFZLEVBQUUsRUFBdUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ25HLENBQUM7O0FBL0ZEOzs7R0FHRztBQUNXLGlDQUFjLEdBQW1CLEVBQUcsQ0FBQTsrR0FoRHZDLGtCQUFrQjttR0FBbEIsa0JBQWtCLHFiQUdaLHNCQUFzQixnSEFFUCxnQkFBZ0IsMkNBbEJ0Qzs7Ozs7OztHQU9UOzJGQU1VLGtCQUFrQjtrQkFmOUIsU0FBUzsrQkFDRSxXQUFXLFlBQ1g7Ozs7Ozs7R0FPVDtpR0FTK0MsY0FBYztzQkFBN0QsZUFBZTt1QkFBQyxzQkFBc0I7Z0JBRWlDLFNBQVM7c0JBQWhGLFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBRzNDLE9BQU87c0JBQTFCLEtBQUs7Z0JBS1UsT0FBTztzQkFBdEIsS0FBSztnQkFTVyxPQUFPO3NCQUF2QixNQUFNO2dCQUNVLFFBQVE7c0JBQXhCLE1BQU07Z0JBQ1UsU0FBUztzQkFBekIsTUFBTTtnQkFDVSxNQUFNO3NCQUF0QixNQUFNO2dCQUNVLFdBQVc7c0JBQTNCLE1BQU07Z0JBQ1UsVUFBVTtzQkFBMUIsTUFBTTtnQkFDVSxTQUFTO3NCQUF6QixNQUFNO2dCQUNVLFFBQVE7c0JBQXhCLE1BQU07Z0JBQ1UsU0FBUztzQkFBekIsTUFBTTtnQkFDVSxRQUFRO3NCQUF4QixNQUFNO2dCQUNVLGFBQWE7c0JBQTdCLE1BQU07Z0JBQ1UsWUFBWTtzQkFBNUIsTUFBTTs7QUE2R1Q7O0lBRUk7QUFDSixNQUFNLFVBQVUsb0JBQW9CLENBQUMsSUFBdUMsRUFBRSxDQUFvQyxFQUFFLEdBQVksRUFBRSxNQUFlO0lBQy9JLElBQUksR0FBRyxFQUFFO1FBQ1AsRUFBRTtRQUNGLGtIQUFrSDtRQUNsSCxFQUFFO1FBQ0YsSUFBSSxDQUFDLElBQUk7WUFBRSxPQUFPO1FBQ2xCLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxTQUFTLEdBQUksSUFBSSxDQUFDLGFBQXlDLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQztZQUM1RixrR0FBa0c7WUFDbEcsb0JBQW9CO1lBQ3BCLHVDQUF1QztZQUN2QyxvREFBb0Q7WUFDcEQsOEZBQThGO1lBQzlGLElBQUk7WUFDSixNQUFNLE9BQU8sR0FBRyxTQUFTLEVBQUUsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDL0QsTUFBTSxJQUFJLEdBQUcsT0FBTyxFQUFFLFFBQVEsQ0FBQztZQUMvQixJQUFJLENBQUMsSUFBSTtnQkFBRSxPQUFPO1lBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1lBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBcUIsQ0FBQztZQUNyQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDaEI7YUFBTTtZQUNMLE1BQU0sUUFBUSxHQUFJLElBQTRCLENBQUMsU0FBUyxDQUFDO1lBQ3pELE1BQU0sV0FBVyxHQUFHLFFBQVEsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLHNCQUFzQixDQUFDLENBQUM7WUFDakYsTUFBTSxRQUFRLEdBQUcsV0FBVyxFQUFFLFFBQVEsQ0FBQztZQUN2QyxJQUFJLENBQUMsUUFBUTtnQkFBRSxPQUFPO1lBQ3RCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFBO1lBRTFCLHdKQUF3SjtZQUN4SixNQUFNLFFBQVEsR0FBSSxDQUF1QixDQUFDLFFBQVEsQ0FBQztZQUNuRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ2hGLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtnQkFDMUIsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsUUFBc0IsQ0FBQztnQkFDdEYsSUFBSSxPQUFPLFdBQVcsRUFBRSxTQUFTLEtBQUssVUFBVSxJQUFJLE9BQU8sV0FBVyxFQUFFLFdBQVcsS0FBSyxVQUFVLEVBQUU7b0JBQ2xHLCtEQUErRDtvQkFDL0QsUUFBUSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7b0JBQ25DLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzVCO2FBQ0Y7WUFFRCxPQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDcEI7S0FDRjtTQUFNO1FBQ0wsRUFBRTtRQUNGLGtHQUFrRztRQUNsRywyRkFBMkY7UUFDM0YsRUFBRTtRQUNGLE1BQU0sQ0FBQyxHQUFHLENBQWtCLENBQUM7UUFDN0IsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLElBQUksR0FBSSxDQUFDLENBQUMsRUFBMEIsRUFBRSxTQUFTLENBQUM7WUFDdEQsSUFBSSxJQUFJLEVBQUUsR0FBRztnQkFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOztnQkFDN0IsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDO1NBQzFCO2FBQU07WUFDTCxNQUFNLFFBQVEsR0FBSSxDQUFDLENBQUMsRUFBOEIsRUFBRSxhQUFhLENBQUM7WUFDbEUsSUFBSSxRQUFRLEVBQUUsR0FBRztnQkFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOztnQkFDckMsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDO1NBQzlCO0tBQ0Y7SUFDRCxPQUFPO0FBQ1QsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLHNCQUFzQixDQUFDLENBQWtCLEVBQUUsQ0FBb0I7SUFDN0UsTUFBTSxRQUFRLEdBQUksQ0FBQyxDQUFDLEVBQThCLEVBQUUsYUFBYSxDQUFDO0lBQ2xFLElBQUksUUFBUSxFQUFFO1FBQ1osTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsQ0FBQztRQUNoRCxJQUFJLEtBQUssRUFBRTtZQUNULENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ2pCO1FBQ0QsT0FBTztLQUNSO0lBQ0QscUJBQXFCO0lBQ3JCLE1BQU0sSUFBSSxHQUFJLENBQUMsQ0FBQyxFQUEwQixFQUFFLFNBQVMsQ0FBQztJQUN0RCxJQUFJLElBQUksRUFBRTtRQUNSLDJCQUEyQjtLQUM1QjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGdyaWRzdGFjay5jb21wb25lbnQudHMgOC4zLjAtZGV2XG4gKiBDb3B5cmlnaHQgKGMpIDIwMjIgQWxhaW4gRHVtZXNueSAtIHNlZSBHcmlkU3RhY2sgcm9vdCBsaWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsXG4gIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFF1ZXJ5TGlzdCwgVHlwZSwgVmlld0NoaWxkLCBWaWV3Q29udGFpbmVyUmVmLCByZWZsZWN0Q29tcG9uZW50VHlwZSwgQ29tcG9uZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBHcmlkSFRNTEVsZW1lbnQsIEdyaWRJdGVtSFRNTEVsZW1lbnQsIEdyaWRTdGFjaywgR3JpZFN0YWNrTm9kZSwgR3JpZFN0YWNrT3B0aW9ucywgR3JpZFN0YWNrV2lkZ2V0IH0gZnJvbSAnZ3JpZHN0YWNrJztcblxuaW1wb3J0IHsgR3JpZEl0ZW1Db21wSFRNTEVsZW1lbnQsIEdyaWRzdGFja0l0ZW1Db21wb25lbnQgfSBmcm9tICcuL2dyaWRzdGFjay1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBCYXNlV2lkZ2V0IH0gZnJvbSAnLi9iYXNlLXdpZGdldCc7XG5cbi8qKiBldmVudHMgaGFuZGxlcnMgZW1pdHRlcnMgc2lnbmF0dXJlIGZvciBkaWZmZXJlbnQgZXZlbnRzICovXG5leHBvcnQgdHlwZSBldmVudENCID0ge2V2ZW50OiBFdmVudH07XG5leHBvcnQgdHlwZSBlbGVtZW50Q0IgPSB7ZXZlbnQ6IEV2ZW50LCBlbDogR3JpZEl0ZW1IVE1MRWxlbWVudH07XG5leHBvcnQgdHlwZSBub2Rlc0NCID0ge2V2ZW50OiBFdmVudCwgbm9kZXM6IEdyaWRTdGFja05vZGVbXX07XG5leHBvcnQgdHlwZSBkcm9wcGVkQ0IgPSB7ZXZlbnQ6IEV2ZW50LCBwcmV2aW91c05vZGU6IEdyaWRTdGFja05vZGUsIG5ld05vZGU6IEdyaWRTdGFja05vZGV9O1xuXG5leHBvcnQgdHlwZSBOZ0NvbXBJbnB1dHMgPSB7W2tleTogc3RyaW5nXTogYW55fTtcblxuLyoqIGV4dGVuZHMgdG8gc3RvcmUgTmcgQ29tcG9uZW50IHNlbGVjdG9yLCBpbnN0ZWFkL2luQWRkaXRpb24gdG8gY29udGVudCAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ0dyaWRTdGFja1dpZGdldCBleHRlbmRzIEdyaWRTdGFja1dpZGdldCB7XG4gIHNlbGVjdG9yPzogc3RyaW5nOyAvLyBjb21wb25lbnQgdHlwZSB0byBjcmVhdGUgYXMgY29udGVudFxuICBpbnB1dD86IE5nQ29tcElucHV0czsgLy8gc2VyaWFsaXplZCBkYXRhIGZvciB0aGUgY29tcG9uZW50IGlucHV0IGZpZWxkc1xufVxuZXhwb3J0IGludGVyZmFjZSBOZ0dyaWRTdGFja05vZGUgZXh0ZW5kcyBHcmlkU3RhY2tOb2RlIHtcbiAgc2VsZWN0b3I/OiBzdHJpbmc7IC8vIGNvbXBvbmVudCB0eXBlIHRvIGNyZWF0ZSBhcyBjb250ZW50XG59XG5leHBvcnQgaW50ZXJmYWNlIE5nR3JpZFN0YWNrT3B0aW9ucyBleHRlbmRzIEdyaWRTdGFja09wdGlvbnMge1xuICBjaGlsZHJlbj86IE5nR3JpZFN0YWNrV2lkZ2V0W107XG4gIHN1YkdyaWRPcHRzPzogTmdHcmlkU3RhY2tPcHRpb25zO1xufVxuXG4vKiogc3RvcmUgZWxlbWVudCB0byBOZyBDbGFzcyBwb2ludGVyIGJhY2sgKi9cbmV4cG9ydCBpbnRlcmZhY2UgR3JpZENvbXBIVE1MRWxlbWVudCBleHRlbmRzIEdyaWRIVE1MRWxlbWVudCB7XG4gIF9ncmlkQ29tcD86IEdyaWRzdGFja0NvbXBvbmVudDtcbn1cblxuLyoqIHNlbGVjdG9yIHN0cmluZyB0byBydW50aW1lIFR5cGUgbWFwcGluZyAqL1xuZXhwb3J0IHR5cGUgU2VsZWN0b3JUb1R5cGUgPSB7W2tleTogc3RyaW5nXTogVHlwZTxPYmplY3Q+fTtcblxuLyoqXG4gKiBIVE1MIENvbXBvbmVudCBXcmFwcGVyIGZvciBncmlkc3RhY2ssIGluIGNvbWJpbmF0aW9uIHdpdGggR3JpZHN0YWNrSXRlbUNvbXBvbmVudCBmb3IgdGhlIGl0ZW1zXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dyaWRzdGFjaycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPCEtLSBjb250ZW50IHRvIHNob3cgd2hlbiB3aGVuIGdyaWQgaXMgZW1wdHksIGxpa2UgaW5zdHJ1Y3Rpb25zIG9uIGhvdyB0byBhZGQgd2lkZ2V0cyAtLT5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbZW1wdHktY29udGVudF1cIiAqbmdJZj1cImlzRW1wdHlcIj48L25nLWNvbnRlbnQ+XG4gICAgPCEtLSB3aGVyZSBkeW5hbWljIGl0ZW1zIGdvIC0tPlxuICAgIDxuZy10ZW1wbGF0ZSAjY29udGFpbmVyPjwvbmctdGVtcGxhdGU+XG4gICAgPCEtLSB3aGVyZSB0ZW1wbGF0ZSBpdGVtcyBnbyAtLT5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIGAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCB7IGRpc3BsYXk6IGJsb2NrOyB9XG4gIGBdLFxuICAvLyBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgLy8gSUZGIHlvdSB3YW50IHRvIG9wdGltaXplIGFuZCBjb250cm9sIHdoZW4gQ2hhbmdlRGV0ZWN0aW9uIG5lZWRzIHRvIGhhcHBlbi4uLlxufSlcbmV4cG9ydCBjbGFzcyBHcmlkc3RhY2tDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG5cbiAgLyoqIHRyYWNrIGxpc3Qgb2YgVEVNUExBVEUgZ3JpZCBpdGVtcyBzbyB3ZSBjYW4gc3luYyBiZXR3ZWVuIERPTSBhbmQgR1MgaW50ZXJuYWxzICovXG4gIEBDb250ZW50Q2hpbGRyZW4oR3JpZHN0YWNrSXRlbUNvbXBvbmVudCkgcHVibGljIGdyaWRzdGFja0l0ZW1zPzogUXVlcnlMaXN0PEdyaWRzdGFja0l0ZW1Db21wb25lbnQ+O1xuICAvKiogY29udGFpbmVyIHRvIGFwcGVuZCBpdGVtcyBkeW5hbWljYWxseSAqL1xuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogdHJ1ZX0pIHB1YmxpYyBjb250YWluZXI/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBpbml0aWFsIG9wdGlvbnMgZm9yIGNyZWF0aW9uIG9mIHRoZSBncmlkICovXG4gIEBJbnB1dCgpIHB1YmxpYyBzZXQgb3B0aW9ucyh2YWw6IEdyaWRTdGFja09wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IHZhbDsgfVxuICAvKiogcmV0dXJuIHRoZSBjdXJyZW50IHJ1bm5pbmcgb3B0aW9ucyAqL1xuICBwdWJsaWMgZ2V0IG9wdGlvbnMoKTogR3JpZFN0YWNrT3B0aW9ucyB7IHJldHVybiB0aGlzLl9ncmlkPy5vcHRzIHx8IHRoaXMuX29wdGlvbnMgfHwge307IH1cblxuICAvKiogdHJ1ZSB3aGlsZSBuZy1jb250ZW50IHdpdGggJ25vLWl0ZW0tY29udGVudCcgc2hvdWxkIGJlIHNob3duIHdoZW4gbGFzdCBpdGVtIGlzIHJlbW92ZWQgZnJvbSBhIGdyaWQgKi9cbiAgQElucHV0KCkgcHVibGljIGlzRW1wdHk/OiBib29sZWFuO1xuXG4gIC8qKiBpbmRpdmlkdWFsIGxpc3Qgb2YgR3JpZFN0YWNrRXZlbnQgY2FsbGJhY2tzIGhhbmRsZXJzIGFzIG91dHB1dFxuICAgKiBvdGhlcndpc2UgdXNlIHRoaXMuZ3JpZC5vbignbmFtZTEgbmFtZTIgbmFtZTMnLCBjYWxsYmFjaykgdG8gaGFuZGxlIG11bHRpcGxlIGF0IG9uY2VcbiAgICogc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ncmlkc3RhY2svZ3JpZHN0YWNrLmpzL2Jsb2IvbWFzdGVyL2RlbW8vZXZlbnRzLmpzI0w0XG4gICAqXG4gICAqIE5vdGU6IGNhbWVsIGNhc2luZyBhbmQgJ0NCJyBhZGRlZCBhdCB0aGUgZW5kIHRvIHByZXZlbnQgQGFuZ3VsYXItZXNsaW50L25vLW91dHB1dC1uYXRpdmVcbiAgICogZWc6ICdjaGFuZ2UnIHdvdWxkIHRyaWdnZXIgdGhlIHJhdyBDdXN0b21FdmVudCBzbyB1c2UgZGlmZmVyZW50IG5hbWUuXG4gICAqL1xuICBAT3V0cHV0KCkgcHVibGljIGFkZGVkQ0IgPSBuZXcgRXZlbnRFbWl0dGVyPG5vZGVzQ0I+KCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhbmdlQ0IgPSBuZXcgRXZlbnRFbWl0dGVyPG5vZGVzQ0I+KCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgZGlzYWJsZUNCID0gbmV3IEV2ZW50RW1pdHRlcjxldmVudENCPigpO1xuICBAT3V0cHV0KCkgcHVibGljIGRyYWdDQiA9IG5ldyBFdmVudEVtaXR0ZXI8ZWxlbWVudENCPigpO1xuICBAT3V0cHV0KCkgcHVibGljIGRyYWdTdGFydENCID0gbmV3IEV2ZW50RW1pdHRlcjxlbGVtZW50Q0I+KCk7XG4gIEBPdXRwdXQoKSBwdWJsaWMgZHJhZ1N0b3BDQiA9IG5ldyBFdmVudEVtaXR0ZXI8ZWxlbWVudENCPigpO1xuICBAT3V0cHV0KCkgcHVibGljIGRyb3BwZWRDQiA9IG5ldyBFdmVudEVtaXR0ZXI8ZHJvcHBlZENCPigpO1xuICBAT3V0cHV0KCkgcHVibGljIGVuYWJsZUNCID0gbmV3IEV2ZW50RW1pdHRlcjxldmVudENCPigpO1xuICBAT3V0cHV0KCkgcHVibGljIHJlbW92ZWRDQiA9IG5ldyBFdmVudEVtaXR0ZXI8bm9kZXNDQj4oKTtcbiAgQE91dHB1dCgpIHB1YmxpYyByZXNpemVDQiA9IG5ldyBFdmVudEVtaXR0ZXI8ZWxlbWVudENCPigpO1xuICBAT3V0cHV0KCkgcHVibGljIHJlc2l6ZVN0YXJ0Q0IgPSBuZXcgRXZlbnRFbWl0dGVyPGVsZW1lbnRDQj4oKTtcbiAgQE91dHB1dCgpIHB1YmxpYyByZXNpemVTdG9wQ0IgPSBuZXcgRXZlbnRFbWl0dGVyPGVsZW1lbnRDQj4oKTtcblxuICAvKiogcmV0dXJuIHRoZSBuYXRpdmUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIGdyaWQgc3BlY2lmaWMgZmllbGRzIGFzIHdlbGwgKi9cbiAgcHVibGljIGdldCBlbCgpOiBHcmlkQ29tcEhUTUxFbGVtZW50IHsgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50OyB9XG5cbiAgLyoqIHJldHVybiB0aGUgR3JpZFN0YWNrIGNsYXNzICovXG4gIHB1YmxpYyBnZXQgZ3JpZCgpOiBHcmlkU3RhY2sgfCB1bmRlZmluZWQgeyByZXR1cm4gdGhpcy5fZ3JpZDsgfVxuXG4gIC8qKiBDb21wb25lbnRSZWYgb2Ygb3Vyc2VsZiAtIHVzZWQgYnkgZHluYW1pYyBvYmplY3QgdG8gY29ycmVjdGx5IGdldCByZW1vdmVkICovXG4gIHB1YmxpYyByZWY6IENvbXBvbmVudFJlZjxHcmlkc3RhY2tDb21wb25lbnQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBzdG9yZXMgdGhlIHNlbGVjdG9yIC0+IFR5cGUgbWFwcGluZywgc28gd2UgY2FuIGNyZWF0ZSBpdGVtcyBkeW5hbWljYWxseSBmcm9tIGEgc3RyaW5nLlxuICAgKiBVbmZvcnR1bmF0ZWx5IE5nIGRvZXNuJ3QgcHJvdmlkZSBwdWJsaWMgYWNjZXNzIHRvIHRoYXQgbWFwcGluZy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2VsZWN0b3JUb1R5cGU6IFNlbGVjdG9yVG9UeXBlID0ge307XG4gIC8qKiBhZGQgYSBsaXN0IG9mIG5nIENvbXBvbmVudCB0byBiZSBtYXBwZWQgdG8gc2VsZWN0b3IgKi9cbiAgcHVibGljIHN0YXRpYyBhZGRDb21wb25lbnRUb1NlbGVjdG9yVHlwZSh0eXBlTGlzdDogQXJyYXk8VHlwZTxPYmplY3Q+Pikge1xuICAgIHR5cGVMaXN0LmZvckVhY2godHlwZSA9PiBHcmlkc3RhY2tDb21wb25lbnQuc2VsZWN0b3JUb1R5cGVbIEdyaWRzdGFja0NvbXBvbmVudC5nZXRTZWxlY3Rvcih0eXBlKSBdID0gdHlwZSk7XG4gIH1cbiAgLyoqIHJldHVybiB0aGUgbmcgQ29tcG9uZW50IHNlbGVjdG9yICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0U2VsZWN0b3IodHlwZTogVHlwZTxPYmplY3Q+KTogc3RyaW5nIHtcbiAgICByZXR1cm4gcmVmbGVjdENvbXBvbmVudFR5cGUodHlwZSkhLnNlbGVjdG9yO1xuICB9XG5cbiAgcHJpdmF0ZSBfb3B0aW9ucz86IEdyaWRTdGFja09wdGlvbnM7XG4gIHByaXZhdGUgX2dyaWQ/OiBHcmlkU3RhY2s7XG4gIHByaXZhdGUgbG9hZGVkPzogYm9vbGVhbjtcbiAgcHJpdmF0ZSBuZ1Vuc3Vic2NyaWJlOiBTdWJqZWN0PHZvaWQ+ID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvLyBwcml2YXRlIHJlYWRvbmx5IHpvbmU6IE5nWm9uZSxcbiAgICAvLyBwcml2YXRlIHJlYWRvbmx5IGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8R3JpZENvbXBIVE1MRWxlbWVudD4sXG4gICkge1xuICAgIHRoaXMuZWwuX2dyaWRDb21wID0gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBpbml0IG91cnNlbGYgYmVmb3JlIGFueSB0ZW1wbGF0ZSBjaGlsZHJlbiBhcmUgY3JlYXRlZCBzaW5jZSB3ZSB0cmFjayB0aGVtIGJlbG93IGFueXdheSAtIG5vIG5lZWQgdG8gZG91YmxlIGNyZWF0ZSt1cGRhdGUgd2lkZ2V0c1xuICAgIHRoaXMubG9hZGVkID0gISF0aGlzLm9wdGlvbnM/LmNoaWxkcmVuPy5sZW5ndGg7XG4gICAgdGhpcy5fZ3JpZCA9IEdyaWRTdGFjay5pbml0KHRoaXMuX29wdGlvbnMsIHRoaXMuZWwpO1xuICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zOyAvLyBHUyBoYXMgaXQgbm93XG5cbiAgICB0aGlzLmNoZWNrRW1wdHkoKTtcbiAgfVxuXG4gIC8qKiB3YWl0IHVudGlsIGFmdGVyIGFsbCBET00gaXMgcmVhZHkgdG8gaW5pdCBncmlkc3RhY2sgY2hpbGRyZW4gKGFmdGVyIGFuZ3VsYXIgbmdGb3IgYW5kIHN1Yi1jb21wb25lbnRzIHJ1biBmaXJzdCkgKi9cbiAgcHVibGljIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcbiAgICAvLyB0cmFjayB3aGVuZXZlciB0aGUgY2hpbGRyZW4gbGlzdCBjaGFuZ2VzIGFuZCB1cGRhdGUgdGhlIGxheW91dC4uLlxuICAgIHRoaXMuZ3JpZHN0YWNrSXRlbXM/LmNoYW5nZXNcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLm5nVW5zdWJzY3JpYmUpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVwZGF0ZUFsbCgpKTtcbiAgICAvLyAuLi5hbmQgZG8gdGhpcyBvbmNlIGF0IGxlYXN0IHVubGVzcyB3ZSBsb2FkZWQgY2hpbGRyZW4gYWxyZWFkeVxuICAgIGlmICghdGhpcy5sb2FkZWQpIHRoaXMudXBkYXRlQWxsKCk7XG4gICAgdGhpcy5ob29rRXZlbnRzKHRoaXMuZ3JpZCk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgZGVsZXRlIHRoaXMucmVmO1xuICAgIHRoaXMubmdVbnN1YnNjcmliZS5uZXh0KCk7XG4gICAgdGhpcy5uZ1Vuc3Vic2NyaWJlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5ncmlkPy5kZXN0cm95KCk7XG4gICAgZGVsZXRlIHRoaXMuX2dyaWQ7XG4gICAgZGVsZXRlIHRoaXMuZWwuX2dyaWRDb21wO1xuICB9XG5cbiAgLyoqXG4gICAqIGNhbGxlZCB3aGVuIHRoZSBURU1QTEFURSBsaXN0IG9mIGl0ZW1zIGNoYW5nZXMgLSBnZXQgYSBsaXN0IG9mIG5vZGVzIGFuZFxuICAgKiB1cGRhdGUgdGhlIGxheW91dCBhY2NvcmRpbmdseSAod2hpY2ggd2lsbCB0YWtlIGNhcmUgb2YgYWRkaW5nL3JlbW92aW5nIGl0ZW1zIGNoYW5nZWQgYnkgQW5ndWxhcilcbiAgICovXG4gIHB1YmxpYyB1cGRhdGVBbGwoKSB7XG4gICAgaWYgKCF0aGlzLmdyaWQpIHJldHVybjtcbiAgICBjb25zdCBsYXlvdXQ6IEdyaWRTdGFja1dpZGdldFtdID0gW107XG4gICAgdGhpcy5ncmlkc3RhY2tJdGVtcz8uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGxheW91dC5wdXNoKGl0ZW0ub3B0aW9ucyk7XG4gICAgICBpdGVtLmNsZWFyT3B0aW9ucygpO1xuICAgIH0pO1xuICAgIHRoaXMuZ3JpZC5sb2FkKGxheW91dCk7IC8vIGVmZmljaWVudCB0aGF0IGRvZXMgZGlmZnMgb25seVxuICB9XG5cbiAgLyoqIGNoZWNrIGlmIHRoZSBncmlkIGlzIGVtcHR5LCBpZiBzbyBzaG93IGFsdGVybmF0aXZlIGNvbnRlbnQgKi9cbiAgcHVibGljIGNoZWNrRW1wdHkoKSB7XG4gICAgaWYgKCF0aGlzLmdyaWQpIHJldHVybjtcbiAgICBjb25zdCBpc0VtcHR5ID0gIXRoaXMuZ3JpZC5lbmdpbmUubm9kZXMubGVuZ3RoO1xuICAgIGlmIChpc0VtcHR5ID09PSB0aGlzLmlzRW1wdHkpIHJldHVybjtcbiAgICB0aGlzLmlzRW1wdHkgPSBpc0VtcHR5O1xuICAgIC8vIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqIGdldCBhbGwga25vd24gZXZlbnRzIGFzIGVhc3kgdG8gdXNlIE91dHB1dHMgZm9yIGNvbnZlbmllbmNlICovXG4gIHByaXZhdGUgaG9va0V2ZW50cyhncmlkPzogR3JpZFN0YWNrKSB7XG4gICAgaWYgKCFncmlkKSByZXR1cm47XG4gICAgZ3JpZFxuICAgIC5vbignYWRkZWQnLCAoZXZlbnQ6IEV2ZW50LCBub2RlczogR3JpZFN0YWNrTm9kZVtdKSA9PiB7IHRoaXMuY2hlY2tFbXB0eSgpOyB0aGlzLmFkZGVkQ0IuZW1pdCh7ZXZlbnQsIG5vZGVzfSk7IH0pXG4gICAgLm9uKCdjaGFuZ2UnLCAoZXZlbnQ6IEV2ZW50LCBub2RlczogR3JpZFN0YWNrTm9kZVtdKSA9PiB0aGlzLmNoYW5nZUNCLmVtaXQoe2V2ZW50LCBub2Rlc30pKVxuICAgIC5vbignZGlzYWJsZScsIChldmVudDogRXZlbnQpID0+IHRoaXMuZGlzYWJsZUNCLmVtaXQoe2V2ZW50fSkpXG4gICAgLm9uKCdkcmFnJywgKGV2ZW50OiBFdmVudCwgZWw6IEdyaWRJdGVtSFRNTEVsZW1lbnQpID0+IHRoaXMuZHJhZ0NCLmVtaXQoe2V2ZW50LCBlbH0pKVxuICAgIC5vbignZHJhZ3N0YXJ0JywgKGV2ZW50OiBFdmVudCwgZWw6IEdyaWRJdGVtSFRNTEVsZW1lbnQpID0+IHRoaXMuZHJhZ1N0YXJ0Q0IuZW1pdCh7ZXZlbnQsIGVsfSkpXG4gICAgLm9uKCdkcmFnc3RvcCcsIChldmVudDogRXZlbnQsIGVsOiBHcmlkSXRlbUhUTUxFbGVtZW50KSA9PiB0aGlzLmRyYWdTdG9wQ0IuZW1pdCh7ZXZlbnQsIGVsfSkpXG4gICAgLm9uKCdkcm9wcGVkJywgKGV2ZW50OiBFdmVudCwgcHJldmlvdXNOb2RlOiBHcmlkU3RhY2tOb2RlLCBuZXdOb2RlOiBHcmlkU3RhY2tOb2RlKSA9PiB0aGlzLmRyb3BwZWRDQi5lbWl0KHtldmVudCwgcHJldmlvdXNOb2RlLCBuZXdOb2RlfSkpXG4gICAgLm9uKCdlbmFibGUnLCAoZXZlbnQ6IEV2ZW50KSA9PiB0aGlzLmVuYWJsZUNCLmVtaXQoe2V2ZW50fSkpXG4gICAgLm9uKCdyZW1vdmVkJywgKGV2ZW50OiBFdmVudCwgbm9kZXM6IEdyaWRTdGFja05vZGVbXSkgPT4geyB0aGlzLmNoZWNrRW1wdHkoKTsgdGhpcy5yZW1vdmVkQ0IuZW1pdCh7ZXZlbnQsIG5vZGVzfSk7IH0pXG4gICAgLm9uKCdyZXNpemUnLCAoZXZlbnQ6IEV2ZW50LCBlbDogR3JpZEl0ZW1IVE1MRWxlbWVudCkgPT4gdGhpcy5yZXNpemVDQi5lbWl0KHtldmVudCwgZWx9KSlcbiAgICAub24oJ3Jlc2l6ZXN0YXJ0JywgKGV2ZW50OiBFdmVudCwgZWw6IEdyaWRJdGVtSFRNTEVsZW1lbnQpID0+IHRoaXMucmVzaXplU3RhcnRDQi5lbWl0KHtldmVudCwgZWx9KSlcbiAgICAub24oJ3Jlc2l6ZXN0b3AnLCAoZXZlbnQ6IEV2ZW50LCBlbDogR3JpZEl0ZW1IVE1MRWxlbWVudCkgPT4gdGhpcy5yZXNpemVTdG9wQ0IuZW1pdCh7ZXZlbnQsIGVsfSkpXG4gIH1cbn1cblxuLyoqXG4gKiBjYW4gYmUgdXNlZCB3aGVuIGEgbmV3IGl0ZW0gbmVlZHMgdG8gYmUgY3JlYXRlZCwgd2hpY2ggd2UgZG8gYXMgYSBBbmd1bGFyIGNvbXBvbmVudCwgb3IgZGVsZXRlZCAoc2tpcClcbiAqKi9cbmV4cG9ydCBmdW5jdGlvbiBnc0NyZWF0ZU5nQ29tcG9uZW50cyhob3N0OiBHcmlkQ29tcEhUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnQsIHc6IE5nR3JpZFN0YWNrV2lkZ2V0IHwgR3JpZFN0YWNrTm9kZSwgYWRkOiBib29sZWFuLCBpc0dyaWQ6IGJvb2xlYW4pOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gIGlmIChhZGQpIHtcbiAgICAvL1xuICAgIC8vIGNyZWF0ZSB0aGUgY29tcG9uZW50IGR5bmFtaWNhbGx5IC0gc2VlIGh0dHBzOi8vYW5ndWxhci5pby9kb2NzL3RzL2xhdGVzdC9jb29rYm9vay9keW5hbWljLWNvbXBvbmVudC1sb2FkZXIuaHRtbFxuICAgIC8vXG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaWYgKGlzR3JpZCkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gKGhvc3QucGFyZW50RWxlbWVudCBhcyBHcmlkSXRlbUNvbXBIVE1MRWxlbWVudCk/Ll9ncmlkSXRlbUNvbXA/LmNvbnRhaW5lcjtcbiAgICAgIC8vIFRPRE86IGZpZ3VyZSBvdXQgaG93IHRvIGNyZWF0ZSBuZyBjb21wb25lbnQgaW5zaWRlIHJlZ3VsYXIgRGl2LiBuZWVkIHRvIGFjY2VzcyBhcHAgaW5qZWN0b3JzLi4uXG4gICAgICAvLyBpZiAoIWNvbnRhaW5lcikge1xuICAgICAgLy8gICBjb25zdCBob3N0RWxlbWVudDogRWxlbWVudCA9IGhvc3Q7XG4gICAgICAvLyAgIGNvbnN0IGVudmlyb25tZW50SW5qZWN0b3I6IEVudmlyb25tZW50SW5qZWN0b3I7XG4gICAgICAvLyAgIGdyaWQgPSBjcmVhdGVDb21wb25lbnQoR3JpZHN0YWNrQ29tcG9uZW50LCB7ZW52aXJvbm1lbnRJbmplY3RvciwgaG9zdEVsZW1lbnR9KT8uaW5zdGFuY2U7XG4gICAgICAvLyB9XG4gICAgICBjb25zdCBncmlkUmVmID0gY29udGFpbmVyPy5jcmVhdGVDb21wb25lbnQoR3JpZHN0YWNrQ29tcG9uZW50KTtcbiAgICAgIGNvbnN0IGdyaWQgPSBncmlkUmVmPy5pbnN0YW5jZTtcbiAgICAgIGlmICghZ3JpZCkgcmV0dXJuO1xuICAgICAgZ3JpZC5yZWYgPSBncmlkUmVmO1xuICAgICAgZ3JpZC5vcHRpb25zID0gdyBhcyBHcmlkU3RhY2tPcHRpb25zO1xuICAgICAgcmV0dXJuIGdyaWQuZWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGdyaWRDb21wID0gKGhvc3QgYXMgR3JpZENvbXBIVE1MRWxlbWVudCkuX2dyaWRDb21wO1xuICAgICAgY29uc3QgZ3JpZEl0ZW1SZWYgPSBncmlkQ29tcD8uY29udGFpbmVyPy5jcmVhdGVDb21wb25lbnQoR3JpZHN0YWNrSXRlbUNvbXBvbmVudCk7XG4gICAgICBjb25zdCBncmlkSXRlbSA9IGdyaWRJdGVtUmVmPy5pbnN0YW5jZTtcbiAgICAgIGlmICghZ3JpZEl0ZW0pIHJldHVybjtcbiAgICAgIGdyaWRJdGVtLnJlZiA9IGdyaWRJdGVtUmVmXG5cbiAgICAgIC8vIElGRiB3ZSdyZSBub3QgYSBzdWJHcmlkLCBkZWZpbmUgd2hhdCB0eXBlIG9mIGNvbXBvbmVudCB0byBjcmVhdGUgYXMgY2hpbGQsIE9SIHlvdSBjYW4gZG8gaXQgR3JpZHN0YWNrSXRlbUNvbXBvbmVudCB0ZW1wbGF0ZSwgYnV0IHRoaXMgaXMgbW9yZSBnZW5lcmljXG4gICAgICBjb25zdCBzZWxlY3RvciA9ICh3IGFzIE5nR3JpZFN0YWNrV2lkZ2V0KS5zZWxlY3RvcjtcbiAgICAgIGNvbnN0IHR5cGUgPSBzZWxlY3RvciA/IEdyaWRzdGFja0NvbXBvbmVudC5zZWxlY3RvclRvVHlwZVtzZWxlY3Rvcl0gOiB1bmRlZmluZWQ7XG4gICAgICBpZiAoIXcuc3ViR3JpZE9wdHMgJiYgdHlwZSkge1xuICAgICAgICBjb25zdCBjaGlsZFdpZGdldCA9IGdyaWRJdGVtLmNvbnRhaW5lcj8uY3JlYXRlQ29tcG9uZW50KHR5cGUpPy5pbnN0YW5jZSBhcyBCYXNlV2lkZ2V0O1xuICAgICAgICBpZiAodHlwZW9mIGNoaWxkV2lkZ2V0Py5zZXJpYWxpemUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGNoaWxkV2lkZ2V0Py5kZXNlcmlhbGl6ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIC8vIHByb3BlciBCYXNlV2lkZ2V0IHN1YmNsYXNzLCBzYXZlIGl0IGFuZCBsb2FkIGFkZGl0aW9uYWwgZGF0YVxuICAgICAgICAgIGdyaWRJdGVtLmNoaWxkV2lkZ2V0ID0gY2hpbGRXaWRnZXQ7XG4gICAgICAgICAgY2hpbGRXaWRnZXQuZGVzZXJpYWxpemUodyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGdyaWRJdGVtLmVsO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvL1xuICAgIC8vIFJFTU9WRSAtIGhhdmUgdG8gY2FsbCBDb21wb25lbnRSZWY6ZGVzdHJveSgpIGZvciBkeW5hbWljIG9iamVjdHMgdG8gY29ycmVjdGx5IHJlbW92ZSB0aGVtc2VsdmVzXG4gICAgLy8gTm90ZTogdGhpcyB3aWxsIGRlc3Ryb3kgYWxsIGNoaWxkcmVuIGR5bmFtaWMgY29tcG9uZW50cyBhcyB3ZWxsOiBncmlkSXRlbSAtPiBjaGlsZFdpZGdldFxuICAgIC8vXG4gICAgY29uc3QgbiA9IHcgYXMgR3JpZFN0YWNrTm9kZTtcbiAgICBpZiAoaXNHcmlkKSB7XG4gICAgICBjb25zdCBncmlkID0gKG4uZWwgYXMgR3JpZENvbXBIVE1MRWxlbWVudCk/Ll9ncmlkQ29tcDtcbiAgICAgIGlmIChncmlkPy5yZWYpIGdyaWQucmVmLmRlc3Ryb3koKTtcbiAgICAgIGVsc2UgZ3JpZD8ubmdPbkRlc3Ryb3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZ3JpZEl0ZW0gPSAobi5lbCBhcyBHcmlkSXRlbUNvbXBIVE1MRWxlbWVudCk/Ll9ncmlkSXRlbUNvbXA7XG4gICAgICBpZiAoZ3JpZEl0ZW0/LnJlZikgZ3JpZEl0ZW0ucmVmLmRlc3Ryb3koKTtcbiAgICAgIGVsc2UgZ3JpZEl0ZW0/Lm5nT25EZXN0cm95KCk7XG4gICAgfVxuICB9XG4gIHJldHVybjtcbn1cblxuLyoqXG4gKiBjYWxsZWQgZm9yIGVhY2ggaXRlbSBpbiB0aGUgZ3JpZCAtIGNoZWNrIGlmIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24gbmVlZHMgdG8gYmUgc2F2ZWQuXG4gKiBOb3RlOiBzaW5jZSB0aGlzIGlzIG9wdGlvbnMgbWludXMgZ3JpZHN0YWNrIHByaXZhdGUgbWVtYmVycyB1c2luZyBVdGlscy5yZW1vdmVJbnRlcm5hbEZvclNhdmUoKSxcbiAqIHRoaXMgdHlwaWNhbGx5IGRvZXNuJ3QgbmVlZCB0byBkbyBhbnl0aGluZy4gSG93ZXZlciB5b3VyIGN1c3RvbSBDb21wb25lbnQgQElucHV0KCkgYXJlIG5vdyBzdXBwb3J0ZWRcbiAqIHVzaW5nIEJhc2VXaWRnZXQuc2VyaWFsaXplKClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdzU2F2ZUFkZGl0aW9uYWxOZ0luZm8objogTmdHcmlkU3RhY2tOb2RlLCB3OiBOZ0dyaWRTdGFja1dpZGdldCkge1xuICBjb25zdCBncmlkSXRlbSA9IChuLmVsIGFzIEdyaWRJdGVtQ29tcEhUTUxFbGVtZW50KT8uX2dyaWRJdGVtQ29tcDtcbiAgaWYgKGdyaWRJdGVtKSB7XG4gICAgY29uc3QgaW5wdXQgPSBncmlkSXRlbS5jaGlsZFdpZGdldD8uc2VyaWFsaXplKCk7XG4gICAgaWYgKGlucHV0KSB7XG4gICAgICB3LmlucHV0ID0gaW5wdXQ7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICAvLyBlbHNlIGNoZWNrIGlmIEdyaWRcbiAgY29uc3QgZ3JpZCA9IChuLmVsIGFzIEdyaWRDb21wSFRNTEVsZW1lbnQpPy5fZ3JpZENvbXA7XG4gIGlmIChncmlkKSB7XG4gICAgLy8uLi4uIHNhdmUgYW55IGN1c3RvbSBkYXRhXG4gIH1cbn1cbiJdfQ==