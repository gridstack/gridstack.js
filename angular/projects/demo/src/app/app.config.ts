import { ApplicationConfig, provideEnvironmentInitializer } from '@angular/core';

import { GridstackComponent } from 'gridstack/dist/angular';
import { AComponent, BComponent, CComponent, NComponent } from './dummy.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentInitializer(() => {
      // register all our dynamic components created in the grid
      GridstackComponent.registerComponents([AComponent, BComponent, CComponent, NComponent]);
    })
  ]
};
