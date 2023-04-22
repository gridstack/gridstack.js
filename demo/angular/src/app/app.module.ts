import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridstackItemComponent } from './gridstack-item.component';
import { GridstackComponent, gsCreateNgComponents, gsSaveAdditionNgInfo } from './gridstack.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';
import { AngularSimpleComponent } from './simple';
import { AComponent, BComponent, CComponent } from './dummy.component';
import { GridStack } from 'gridstack';

@NgModule({
    declarations: [
        AngularNgForCmdTestComponent,
        AngularNgForTestComponent,
        AngularSimpleComponent,
        AppComponent,
        GridstackComponent,
        GridstackItemComponent,
        AComponent,
        BComponent,
        CComponent,
    ],
    imports: [
        BrowserModule
    ],
    exports: [
        GridstackComponent,
        GridstackItemComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // register all our dynamic components created in the grid
    GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent]);
    // set globally our method to create the right widget type
    GridStack.addRemoveCB = gsCreateNgComponents; // DONE in case switcher onShow() as well
    GridStack.saveCB = gsSaveAdditionNgInfo;
  }
}
