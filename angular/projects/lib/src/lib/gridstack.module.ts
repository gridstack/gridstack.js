/**
 * gridstack.component.ts 12.4.2
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

import { NgModule } from "@angular/core";

import { GridstackItemComponent } from "./gridstack-item.component";
import { GridstackComponent } from "./gridstack.component";

/**
 * @deprecated Use GridstackComponent and GridstackItemComponent as standalone components instead.
 *
 * This NgModule is provided for backward compatibility but is no longer the recommended approach.
 * Import components directly in your standalone components or use the new Angular module structure.
 *
 * @example
 * ```typescript
 * // Preferred approach - standalone components
 * @Component({
 *   selector: 'my-app',
 *   imports: [GridstackComponent, GridstackItemComponent],
 *   template: '<gridstack></gridstack>'
 * })
 * export class AppComponent {}
 *
 * // Legacy approach (deprecated)
 * @NgModule({
 *   imports: [GridstackModule]
 * })
 * export class AppModule {}
 * ```
 */
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
