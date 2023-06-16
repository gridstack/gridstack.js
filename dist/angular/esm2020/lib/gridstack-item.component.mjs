/**
 * gridstack-item.component.ts 8.3.0-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */
import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * HTML Component Wrapper for gridstack items, in combination with GridstackComponent for parent grid
 */
export class GridstackItemComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.el._gridItemComp = this;
    }
    /** list of options for creating/updating this item */
    set options(val) {
        if (this.el.gridstackNode?.grid) {
            // already built, do an update...
            this.el.gridstackNode.grid.update(this.el, val);
        }
        else {
            // store our custom element in options so we can update it and not re-create a generic div!
            this._options = { ...val, el: this.el };
        }
    }
    /** return the latest grid options (from GS once built, otherwise initial values) */
    get options() {
        return this.el.gridstackNode || this._options || { el: this.el };
    }
    /** return the native element that contains grid specific fields as well */
    get el() { return this.elementRef.nativeElement; }
    /** clears the initial options now that we've built */
    clearOptions() {
        delete this._options;
    }
    ngOnDestroy() {
        delete this.ref;
        delete this.el._gridItemComp;
    }
}
GridstackItemComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackItemComponent, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
GridstackItemComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: GridstackItemComponent, selector: "gridstack-item", inputs: { options: "options" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true, read: ViewContainerRef, static: true }], ngImport: i0, template: `
    <div class="grid-stack-item-content">
      <!-- where dynamic items go based on component types, or sub-grids, etc...) -->
      <ng-template #container></ng-template>
      <!-- any static (defined in dom) content goes here -->
      <ng-content></ng-content>
      <!-- fallback HTML content from GridStackWidget content field if used instead -->
      {{options.content}}
    </div>`, isInline: true, styles: [":host{display:block}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gridstack-item', template: `
    <div class="grid-stack-item-content">
      <!-- where dynamic items go based on component types, or sub-grids, etc...) -->
      <ng-template #container></ng-template>
      <!-- any static (defined in dom) content goes here -->
      <ng-content></ng-content>
      <!-- fallback HTML content from GridStackWidget content field if used instead -->
      {{options.content}}
    </div>`, styles: [":host{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { container: [{
                type: ViewChild,
                args: ['container', { read: ViewContainerRef, static: true }]
            }], options: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0YWNrLWl0ZW0uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYW5ndWxhci9wcm9qZWN0cy9saWIvc3JjL2xpYi9ncmlkc3RhY2staXRlbS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBYyxLQUFLLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUEyQixNQUFNLGVBQWUsQ0FBQzs7QUFTbkg7O0dBRUc7QUFpQkgsTUFBTSxPQUFPLHNCQUFzQjtJQW9DakMsWUFBNkIsVUFBMkM7UUFBM0MsZUFBVSxHQUFWLFVBQVUsQ0FBaUM7UUFDdEUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQy9CLENBQUM7SUEzQkQsc0RBQXNEO0lBQ3RELElBQW9CLE9BQU8sQ0FBQyxHQUFrQjtRQUM1QyxJQUFJLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRTtZQUMvQixpQ0FBaUM7WUFDakMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2pEO2FBQU07WUFDTCwyRkFBMkY7WUFDM0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBQ0Qsb0ZBQW9GO0lBQ3BGLElBQVcsT0FBTztRQUNoQixPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksRUFBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDO0lBQ2pFLENBQUM7SUFJRCwyRUFBMkU7SUFDM0UsSUFBVyxFQUFFLEtBQThCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBRWxGLHNEQUFzRDtJQUMvQyxZQUFZO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBTU0sV0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDaEIsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUMvQixDQUFDOzttSEEzQ1Usc0JBQXNCO3VHQUF0QixzQkFBc0IseUtBR0QsZ0JBQWdCLDJDQWpCdEM7Ozs7Ozs7O1dBUUQ7MkZBTUUsc0JBQXNCO2tCQWhCbEMsU0FBUzsrQkFDRSxnQkFBZ0IsWUFDaEI7Ozs7Ozs7O1dBUUQ7aUdBUytELFNBQVM7c0JBQWhGLFNBQVM7dUJBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBUzNDLE9BQU87c0JBQTFCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGdyaWRzdGFjay1pdGVtLmNvbXBvbmVudC50cyA4LjMuMC1kZXZcbiAqIENvcHlyaWdodCAoYykgMjAyMiBBbGFpbiBEdW1lc255IC0gc2VlIEdyaWRTdGFjayByb290IGxpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIElucHV0LCBWaWV3Q2hpbGQsIFZpZXdDb250YWluZXJSZWYsIE9uRGVzdHJveSwgQ29tcG9uZW50UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHcmlkSXRlbUhUTUxFbGVtZW50LCBHcmlkU3RhY2tOb2RlIH0gZnJvbSAnZ3JpZHN0YWNrJztcbmltcG9ydCB7IEJhc2VXaWRnZXQgfSBmcm9tICcuL2Jhc2Utd2lkZ2V0JztcblxuLyoqIHN0b3JlIGVsZW1lbnQgdG8gTmcgQ2xhc3MgcG9pbnRlciBiYWNrICovXG5leHBvcnQgaW50ZXJmYWNlIEdyaWRJdGVtQ29tcEhUTUxFbGVtZW50IGV4dGVuZHMgR3JpZEl0ZW1IVE1MRWxlbWVudCB7XG4gIF9ncmlkSXRlbUNvbXA/OiBHcmlkc3RhY2tJdGVtQ29tcG9uZW50O1xufVxuXG4vKipcbiAqIEhUTUwgQ29tcG9uZW50IFdyYXBwZXIgZm9yIGdyaWRzdGFjayBpdGVtcywgaW4gY29tYmluYXRpb24gd2l0aCBHcmlkc3RhY2tDb21wb25lbnQgZm9yIHBhcmVudCBncmlkXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dyaWRzdGFjay1pdGVtJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZ3JpZC1zdGFjay1pdGVtLWNvbnRlbnRcIj5cbiAgICAgIDwhLS0gd2hlcmUgZHluYW1pYyBpdGVtcyBnbyBiYXNlZCBvbiBjb21wb25lbnQgdHlwZXMsIG9yIHN1Yi1ncmlkcywgZXRjLi4uKSAtLT5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjY29udGFpbmVyPjwvbmctdGVtcGxhdGU+XG4gICAgICA8IS0tIGFueSBzdGF0aWMgKGRlZmluZWQgaW4gZG9tKSBjb250ZW50IGdvZXMgaGVyZSAtLT5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwhLS0gZmFsbGJhY2sgSFRNTCBjb250ZW50IGZyb20gR3JpZFN0YWNrV2lkZ2V0IGNvbnRlbnQgZmllbGQgaWYgdXNlZCBpbnN0ZWFkIC0tPlxuICAgICAge3tvcHRpb25zLmNvbnRlbnR9fVxuICAgIDwvZGl2PmAsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCB7IGRpc3BsYXk6IGJsb2NrOyB9XG4gIGBdLFxuICAvLyBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCwgLy8gSUZGIHlvdSB3YW50IHRvIG9wdGltaXplIGFuZCBjb250cm9sIHdoZW4gQ2hhbmdlRGV0ZWN0aW9uIG5lZWRzIHRvIGhhcHBlbi4uLlxufSlcbmV4cG9ydCBjbGFzcyBHcmlkc3RhY2tJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICAvKiogY29udGFpbmVyIHRvIGFwcGVuZCBpdGVtcyBkeW5hbWljYWxseSAqL1xuICBAVmlld0NoaWxkKCdjb250YWluZXInLCB7IHJlYWQ6IFZpZXdDb250YWluZXJSZWYsIHN0YXRpYzogdHJ1ZX0pIHB1YmxpYyBjb250YWluZXI/OiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIC8qKiBDb21wb25lbnRSZWYgb2Ygb3Vyc2VsZiAtIHVzZWQgYnkgZHluYW1pYyBvYmplY3QgdG8gY29ycmVjdGx5IGdldCByZW1vdmVkICovXG4gIHB1YmxpYyByZWY6IENvbXBvbmVudFJlZjxHcmlkc3RhY2tJdGVtQ29tcG9uZW50PiB8IHVuZGVmaW5lZDtcblxuICAvKiogY2hpbGQgY29tcG9uZW50IHNvIHdlIGNhbiBzYXZlL3Jlc3RvcmUgYWRkaXRpb25hbCBkYXRhIHRvIGJlIHNhdmVkIGFsb25nICovXG4gIHB1YmxpYyBjaGlsZFdpZGdldDogQmFzZVdpZGdldCB8IHVuZGVmaW5lZDtcblxuICAvKiogbGlzdCBvZiBvcHRpb25zIGZvciBjcmVhdGluZy91cGRhdGluZyB0aGlzIGl0ZW0gKi9cbiAgQElucHV0KCkgcHVibGljIHNldCBvcHRpb25zKHZhbDogR3JpZFN0YWNrTm9kZSkge1xuICAgIGlmICh0aGlzLmVsLmdyaWRzdGFja05vZGU/LmdyaWQpIHtcbiAgICAgIC8vIGFscmVhZHkgYnVpbHQsIGRvIGFuIHVwZGF0ZS4uLlxuICAgICAgdGhpcy5lbC5ncmlkc3RhY2tOb2RlLmdyaWQudXBkYXRlKHRoaXMuZWwsIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0b3JlIG91ciBjdXN0b20gZWxlbWVudCBpbiBvcHRpb25zIHNvIHdlIGNhbiB1cGRhdGUgaXQgYW5kIG5vdCByZS1jcmVhdGUgYSBnZW5lcmljIGRpdiFcbiAgICAgIHRoaXMuX29wdGlvbnMgPSB7Li4udmFsLCBlbDogdGhpcy5lbH07XG4gICAgfVxuICB9XG4gIC8qKiByZXR1cm4gdGhlIGxhdGVzdCBncmlkIG9wdGlvbnMgKGZyb20gR1Mgb25jZSBidWlsdCwgb3RoZXJ3aXNlIGluaXRpYWwgdmFsdWVzKSAqL1xuICBwdWJsaWMgZ2V0IG9wdGlvbnMoKTogR3JpZFN0YWNrTm9kZSB7XG4gICAgcmV0dXJuIHRoaXMuZWwuZ3JpZHN0YWNrTm9kZSB8fCB0aGlzLl9vcHRpb25zIHx8IHtlbDogdGhpcy5lbH07XG4gIH1cblxuICBwcml2YXRlIF9vcHRpb25zPzogR3JpZFN0YWNrTm9kZTtcblxuICAvKiogcmV0dXJuIHRoZSBuYXRpdmUgZWxlbWVudCB0aGF0IGNvbnRhaW5zIGdyaWQgc3BlY2lmaWMgZmllbGRzIGFzIHdlbGwgKi9cbiAgcHVibGljIGdldCBlbCgpOiBHcmlkSXRlbUNvbXBIVE1MRWxlbWVudCB7IHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDsgfVxuXG4gIC8qKiBjbGVhcnMgdGhlIGluaXRpYWwgb3B0aW9ucyBub3cgdGhhdCB3ZSd2ZSBidWlsdCAqL1xuICBwdWJsaWMgY2xlYXJPcHRpb25zKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9vcHRpb25zO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEdyaWRJdGVtSFRNTEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5lbC5fZ3JpZEl0ZW1Db21wID0gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5yZWY7XG4gICAgZGVsZXRlIHRoaXMuZWwuX2dyaWRJdGVtQ29tcDtcbiAgfVxufVxuIl19