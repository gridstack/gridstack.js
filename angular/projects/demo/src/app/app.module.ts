import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';
import { AngularSimpleComponent } from './simple';
import { AComponent } from './a.component';

// local testing
// import { GridstackModule } from './gridstack.module';
// import { GridstackComponent } from './gridstack.component';
import { GridstackModule, GridstackComponent } from 'gridstack/dist/angular';
import { InitComponent } from './init.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    GridstackModule,
    FormsModule
  ],
  declarations: [
    AngularNgForCmdTestComponent,
    AngularNgForTestComponent,
    AngularSimpleComponent,
    AppComponent,
    AComponent,
    InitComponent
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [InitComponent]
})
export class AppModule {
  constructor() {
    // register all our dynamic components created in the grid
  }
}
