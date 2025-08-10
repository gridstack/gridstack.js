# gridstack.module

## Classes

### ~~GridstackModule~~

Defined in: [angular/projects/lib/src/lib/gridstack.module.ts:44](https://github.com/adumesny/gridstack.js/blob/master/angular/projects/lib/src/lib/gridstack.module.ts#L44)

#### Deprecated

Use GridstackComponent and GridstackItemComponent as standalone components instead.

This NgModule is provided for backward compatibility but is no longer the recommended approach.
Import components directly in your standalone components or use the new Angular module structure.

#### Example

```typescript
// Preferred approach - standalone components
@Component({
  selector: 'my-app',
  imports: [GridstackComponent, GridstackItemComponent],
  template: '<gridstack></gridstack>'
})
export class AppComponent {}

// Legacy approach (deprecated)
@NgModule({
  imports: [GridstackModule]
})
export class AppModule {}
```

#### Constructors

##### Constructor

```ts
new GridstackModule(): GridstackModule;
```

###### Returns

[`GridstackModule`](#gridstackmodule)
