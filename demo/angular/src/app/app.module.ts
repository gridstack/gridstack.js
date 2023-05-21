/**
 * gridstack.component.ts 8.1.1-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridstackComponent } from '../gridstack.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';
import { AngularSimpleComponent } from './simple';
import { AComponent, BComponent, CComponent } from './dummy.component';

// local copy but user would use 'gridstack/dist/ng/gridstack.module'
import { GridstackModule } from 'src/gridstack.module';

@NgModule({
  imports: [
    BrowserModule,
    GridstackModule,
  ],
  declarations: [
      AngularNgForCmdTestComponent,
      AngularNgForTestComponent,
      AngularSimpleComponent,
      AppComponent,
      AComponent,
      BComponent,
      CComponent,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // register all our dynamic components created in the grid
    GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent]);
  }
}
