import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridstackItemComponent } from './gridstack-item.component';
import { GridstackComponent } from './gridstack.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';
import { AngularSimpleComponent } from './simple';

@NgModule({
  declarations: [
    AppComponent,
    AngularSimpleComponent,
    AngularNgForTestComponent,
    AngularNgForCmdTestComponent,
    GridstackComponent,
    GridstackItemComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
