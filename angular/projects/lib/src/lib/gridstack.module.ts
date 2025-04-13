/**
 * gridstack.component.ts 12.0.0-dev
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import { NgModule } from "@angular/core";

import { GridstackItemComponent } from "./gridstack-item.component";
import { GridstackComponent } from "./gridstack.component";

// @deprecated use GridstackComponent and GridstackItemComponent as standalone components
@NgModule({
  imports: [
    GridstackItemComponent,
    GridstackComponent,
  ],
  exports: [
    GridstackItemComponent,
    GridstackComponent,
  ],
})
export class GridstackModule {}
