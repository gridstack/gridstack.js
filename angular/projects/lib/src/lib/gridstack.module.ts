/**
 * gridstack.component.ts 11.3.0-dev
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import { NgModule } from "@angular/core";

import { GridstackComponent } from "./gridstack.component";
import { GridstackItemComponent } from "./gridstack-item.component";

// @deprecated use GridstackComponent and GridstackItemComponent as standalone components
@NgModule({
  imports: [
    GridstackComponent,
    GridstackItemComponent,
  ],
  exports: [
    GridstackComponent,
    GridstackItemComponent,
  ],
})
export class GridstackModule {}
