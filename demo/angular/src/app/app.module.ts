import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularSimpleComponent } from './simple';

@NgModule({
  declarations: [
    AppComponent,
    AngularSimpleComponent,
    AngularNgForTestComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
