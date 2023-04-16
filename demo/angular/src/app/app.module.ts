import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridstackItemComponent } from './gridstack-item.component';
import { GridstackComponent } from './gridstack.component';
import { AngularNgForTestComponent } from './ngFor';
import { AngularNgForCmdTestComponent } from './ngFor_cmd';
import { AngularSimpleComponent } from './simple';
import { AComponent, BComponent, CComponent } from './dummy.component';

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
export class AppModule { }
