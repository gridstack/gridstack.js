/**
 * gridstack.component.ts 8.2.1
 * Copyright (c) 2022-2024 Alain Dumesny - see GridStack root license
 */

// dummy testing component that will be grid items content

import { Component, OnDestroy, Input, ViewChild, ViewContainerRef } from '@angular/core';

// TEST local testing
// import { BaseWidget } from './base-widget';
// import { NgCompInputs } from './gridstack.component';
import { BaseWidget, NgCompInputs } from 'gridstack/dist/angular';

@Component({
  selector: 'app-a',
  template: 'Comp A {{text}}'
})
export class AComponent extends BaseWidget implements OnDestroy {
  @Input() text: string = 'foo'; // test custom input data
  public override serialize(): NgCompInputs | undefined  { return this.text ? {text: this.text} : undefined; }
  constructor() { super(); console.log('Comp A created'); }
  ngOnDestroy() { console.log('Comp A destroyed'); } // test to make sure cleanup happens
}

@Component({
  selector: 'app-b',
  template: 'Comp B'
})
export class BComponent extends BaseWidget implements OnDestroy {
  constructor() { super(); console.log('Comp B created'); }
  ngOnDestroy() { console.log('Comp B destroyed'); }
}

@Component({
  selector: 'app-c',
  template: 'Comp C'
})
export class CComponent extends BaseWidget implements OnDestroy {
  ngOnDestroy() { console.log('Comp C destroyed'); }
}

/** Component that host a sub-grid as a child with controls above/below it. */
@Component({
  selector: 'app-n',
  template: `
  <div>Comp N</div>
  <ng-template #container></ng-template>
  `,
  /** make the subgrid take entire remaining space even when empty (so you can drag back inside without forcing 1 row) */
  styles: [`
    :host { height: 100%; display: flex; flex-direction: column; }
    ::ng-deep .grid-stack.grid-stack-nested { flex: 1; }
  `]
})
export class NComponent extends BaseWidget implements OnDestroy {
  /** this is where the dynamic nested grid will be hosted. gsCreateNgComponents() looks for 'container' like GridstackItemComponent */
  @ViewChild('container', { read: ViewContainerRef, static: true}) public container?: ViewContainerRef;
  ngOnDestroy() { console.log('Comp N destroyed'); }
}
