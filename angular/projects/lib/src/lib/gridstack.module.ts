/**
 * gridstack.component.ts 10.3.1
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { GridStack } from "gridstack";
import { GridstackComponent, gsCreateNgComponents, gsSaveAdditionalNgInfo } from "./gridstack.component";
import { GridstackItemComponent } from "./gridstack-item.component";

@NgModule({
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
})
export class GridstackModule {
  constructor() {
    // set globally our method to create the right widget type
    GridStack.addRemoveCB = gsCreateNgComponents;
    GridStack.saveCB = gsSaveAdditionalNgInfo;
  }
}
