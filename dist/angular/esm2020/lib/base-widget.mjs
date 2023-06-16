/**
 * gridstack-item.component.ts 8.3.0-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */
/**
 * Base interface that all widgets need to implement in order for GridstackItemComponent to correctly save/load/delete/..
 */
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class BaseWidget {
    /**
     * REDEFINE to return an object representing the data needed to re-create yourself, other than `selector` already handled.
     * This should map directly to the @Input() fields of this objects on create, so a simple apply can be used on read
     */
    serialize() { return; }
    /**
     * REDEFINE this if your widget needs to read from saved data and transform it to create itself - you do this for
     * things that are not mapped directly into @Input() fields for example.
     */
    deserialize(w) {
        if (w.input)
            Object.assign(this, w.input);
    }
}
BaseWidget.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: BaseWidget, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
BaseWidget.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: BaseWidget });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: BaseWidget, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS13aWRnZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hbmd1bGFyL3Byb2plY3RzL2xpYi9zcmMvbGliL2Jhc2Utd2lkZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVIOztHQUVHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJMUMsTUFBTSxPQUFnQixVQUFVO0lBQy9COzs7T0FHRztJQUNJLFNBQVMsS0FBZ0MsT0FBTyxDQUFDLENBQUM7SUFFekQ7OztPQUdHO0lBQ0ksV0FBVyxDQUFDLENBQW9CO1FBQ3JDLElBQUksQ0FBQyxDQUFDLEtBQUs7WUFBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQzs7dUdBYm9CLFVBQVU7MkdBQVYsVUFBVTsyRkFBVixVQUFVO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIGdyaWRzdGFjay1pdGVtLmNvbXBvbmVudC50cyA4LjMuMC1kZXZcclxuICogQ29weXJpZ2h0IChjKSAyMDIyIEFsYWluIER1bWVzbnkgLSBzZWUgR3JpZFN0YWNrIHJvb3QgbGljZW5zZVxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBCYXNlIGludGVyZmFjZSB0aGF0IGFsbCB3aWRnZXRzIG5lZWQgdG8gaW1wbGVtZW50IGluIG9yZGVyIGZvciBHcmlkc3RhY2tJdGVtQ29tcG9uZW50IHRvIGNvcnJlY3RseSBzYXZlL2xvYWQvZGVsZXRlLy4uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZ0NvbXBJbnB1dHMsIE5nR3JpZFN0YWNrV2lkZ2V0IH0gZnJvbSAnLi9ncmlkc3RhY2suY29tcG9uZW50JztcclxuXHJcbiBASW5qZWN0YWJsZSgpXHJcbiBleHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVdpZGdldCB7XHJcbiAgLyoqXHJcbiAgICogUkVERUZJTkUgdG8gcmV0dXJuIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRhdGEgbmVlZGVkIHRvIHJlLWNyZWF0ZSB5b3Vyc2VsZiwgb3RoZXIgdGhhbiBgc2VsZWN0b3JgIGFscmVhZHkgaGFuZGxlZC5cclxuICAgKiBUaGlzIHNob3VsZCBtYXAgZGlyZWN0bHkgdG8gdGhlIEBJbnB1dCgpIGZpZWxkcyBvZiB0aGlzIG9iamVjdHMgb24gY3JlYXRlLCBzbyBhIHNpbXBsZSBhcHBseSBjYW4gYmUgdXNlZCBvbiByZWFkXHJcbiAgICovXHJcbiAgcHVibGljIHNlcmlhbGl6ZSgpOiBOZ0NvbXBJbnB1dHMgfCB1bmRlZmluZWQgIHsgcmV0dXJuOyB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJFREVGSU5FIHRoaXMgaWYgeW91ciB3aWRnZXQgbmVlZHMgdG8gcmVhZCBmcm9tIHNhdmVkIGRhdGEgYW5kIHRyYW5zZm9ybSBpdCB0byBjcmVhdGUgaXRzZWxmIC0geW91IGRvIHRoaXMgZm9yXHJcbiAgICogdGhpbmdzIHRoYXQgYXJlIG5vdCBtYXBwZWQgZGlyZWN0bHkgaW50byBASW5wdXQoKSBmaWVsZHMgZm9yIGV4YW1wbGUuXHJcbiAgICovXHJcbiAgcHVibGljIGRlc2VyaWFsaXplKHc6IE5nR3JpZFN0YWNrV2lkZ2V0KSAge1xyXG4gICAgaWYgKHcuaW5wdXQpICBPYmplY3QuYXNzaWduKHRoaXMsIHcuaW5wdXQpO1xyXG4gIH1cclxuIH1cclxuIl19