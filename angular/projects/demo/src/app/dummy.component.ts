/**
 * gridstack.component.ts 8.2.1
 * Copyright (c) 2022 Alain Dumesny - see GridStack root license
 */

// dummy testing component that will be grid items content

import { Component, OnDestroy, Input } from '@angular/core';
import { BaseWidget, NgCompInputs } from 'gridstack/dist/angular';

@Component({
  selector: 'app-a',
  template: 'Comp A {{text}}',
})
export class AComponent extends BaseWidget implements OnDestroy {
  @Input() text: string = 'foo'; // test custom input data
  public override serialize(): NgCompInputs | undefined  { return this.text ? {text: this.text} : undefined; }
  ngOnDestroy() {
    console.log('Comp A destroyed'); // test to make sure cleanup happens
  }
}

@Component({
  selector: 'app-b',
  template: 'Comp B',
})
export class BComponent extends BaseWidget {
}

@Component({
  selector: 'app-c',
  template: 'Comp C',
})
export class CComponent extends BaseWidget {
}
