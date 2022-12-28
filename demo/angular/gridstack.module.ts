import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GridstackComponent} from './gridstack.component';
import {GridstackItemComponent} from './gridstack-item.component';

@NgModule({
  declarations: [
    GridstackComponent,
    GridstackItemComponent,
  ],
  exports: [
    GridstackComponent,
    GridstackItemComponent,
  ],
  imports: [
    CommonModule,
  ],
})
export class GridstackModule {
}
