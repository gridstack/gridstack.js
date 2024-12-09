import { ApplicationConfig, provideEnvironmentInitializer } from '@angular/core';

// TEST local testing
// import { GridstackComponent } from './gridstack.component';
import { GridstackComponent } from 'gridstack/dist/angular';
import { AComponent, BComponent, CComponent, NComponent } from './dummy.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentInitializer(() => {
      // register all our dynamic components created in the grid
      GridstackComponent.addComponentToSelectorType([AComponent, BComponent, CComponent, NComponent]);
    })
  ]
};
