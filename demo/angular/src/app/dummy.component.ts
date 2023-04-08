/**
 * gridstack.component.ts 7.3.0-dev
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

// dummy testing component that will be grid items content

import { Component, Type } from '@angular/core';

@Component({
  selector: 'app-a',
  template: 'Comp A',
})
export class AComponent {
}

@Component({
  selector: 'app-b',
  template: 'Comp B',
})
export class BComponent {
}

@Component({
  selector: 'app-c',
  template: 'Comp C',
})
export class CComponent {
}

/**
 * stores the selector -> Type mapping, so we can create items dynamically from a string.
 * Unfortunately Ng doesn't provide public access to that mapping.
 */
export const selectorToComponent: {[key: string]: Type<Object>} = {
  'app-a': AComponent,
  'app-b': BComponent,
  'app-c': CComponent,
};
