/**
 * gridstack.component.ts 8.3.0-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { GridStack } from "gridstack";
import { GridstackComponent, gsCreateNgComponents, gsSaveAdditionalNgInfo } from "./gridstack.component";
import { GridstackItemComponent } from "./gridstack-item.component";
import * as i0 from "@angular/core";
export class GridstackModule {
    constructor() {
        // set globally our method to create the right widget type
        GridStack.addRemoveCB = gsCreateNgComponents;
        GridStack.saveCB = gsSaveAdditionalNgInfo;
    }
}
GridstackModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
GridstackModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.3.0", ngImport: i0, type: GridstackModule, declarations: [GridstackComponent,
        GridstackItemComponent], imports: [CommonModule], exports: [GridstackComponent,
        GridstackItemComponent] });
GridstackModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: GridstackModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                    ],
                    declarations: [
                        GridstackComponent,
                        GridstackItemComponent,
                    ],
                    exports: [
                        GridstackComponent,
                        GridstackItemComponent,
                    ],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZHN0YWNrLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FuZ3VsYXIvcHJvamVjdHMvbGliL3NyYy9saWIvZ3JpZHN0YWNrLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3pHLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDOztBQWVwRSxNQUFNLE9BQU8sZUFBZTtJQUMxQjtRQUNFLDBEQUEwRDtRQUMxRCxTQUFTLENBQUMsV0FBVyxHQUFHLG9CQUFvQixDQUFDO1FBQzdDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsc0JBQXNCLENBQUM7SUFDNUMsQ0FBQzs7NEdBTFUsZUFBZTs2R0FBZixlQUFlLGlCQVJ4QixrQkFBa0I7UUFDbEIsc0JBQXNCLGFBSnRCLFlBQVksYUFPWixrQkFBa0I7UUFDbEIsc0JBQXNCOzZHQUdiLGVBQWUsWUFYeEIsWUFBWTsyRkFXSCxlQUFlO2tCQWIzQixRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3FCQUNiO29CQUNELFlBQVksRUFBRTt3QkFDWixrQkFBa0I7d0JBQ2xCLHNCQUFzQjtxQkFDdkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLGtCQUFrQjt3QkFDbEIsc0JBQXNCO3FCQUN2QjtpQkFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBncmlkc3RhY2suY29tcG9uZW50LnRzIDguMy4wLWRldlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMjIgQWxhaW4gRHVtZXNueSAtIHNlZSBHcmlkU3RhY2sgcm9vdCBsaWNlbnNlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5cclxuaW1wb3J0IHsgR3JpZFN0YWNrIH0gZnJvbSBcImdyaWRzdGFja1wiO1xyXG5pbXBvcnQgeyBHcmlkc3RhY2tDb21wb25lbnQsIGdzQ3JlYXRlTmdDb21wb25lbnRzLCBnc1NhdmVBZGRpdGlvbmFsTmdJbmZvIH0gZnJvbSBcIi4vZ3JpZHN0YWNrLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBHcmlkc3RhY2tJdGVtQ29tcG9uZW50IH0gZnJvbSBcIi4vZ3JpZHN0YWNrLWl0ZW0uY29tcG9uZW50XCI7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgR3JpZHN0YWNrQ29tcG9uZW50LFxyXG4gICAgR3JpZHN0YWNrSXRlbUNvbXBvbmVudCxcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEdyaWRzdGFja0NvbXBvbmVudCxcclxuICAgIEdyaWRzdGFja0l0ZW1Db21wb25lbnQsXHJcbiAgXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEdyaWRzdGFja01vZHVsZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAvLyBzZXQgZ2xvYmFsbHkgb3VyIG1ldGhvZCB0byBjcmVhdGUgdGhlIHJpZ2h0IHdpZGdldCB0eXBlXHJcbiAgICBHcmlkU3RhY2suYWRkUmVtb3ZlQ0IgPSBnc0NyZWF0ZU5nQ29tcG9uZW50cztcclxuICAgIEdyaWRTdGFjay5zYXZlQ0IgPSBnc1NhdmVBZGRpdGlvbmFsTmdJbmZvO1xyXG4gIH1cclxufVxyXG4iXX0=