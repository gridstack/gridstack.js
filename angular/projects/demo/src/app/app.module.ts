import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';
import { AngularSimpleComponent } from './simple';
import { AComponent, BComponent, CComponent, NComponent } from './dummy.component';

// TEST local testing
// import { GridstackModule } from './gridstack.module';
// import { GridstackComponent } from './gridstack.component';
import { GridstackModule, GridstackComponent } from 'gridstack/dist/angular';

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
    NComponent,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // register all our dynamic components created in the grid
    GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent, NComponent]);
  }
}
