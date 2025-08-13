# Testing Guide

This project uses **Vitest** as the modern testing framework, replacing the previous Karma + Jasmine setup. Vitest provides faster test execution, better TypeScript support, and enhanced developer experience.

## Quick Start

```bash
# Install dependencies
yarn install

# Run all tests once
yarn test

# Run tests in watch mode (development)
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Open coverage report in browser  
yarn test:coverage:html

# Run tests with UI interface
yarn test:ui
```

## Testing Framework

### Vitest Features
- ⚡ **Fast**: Native ESM support and Vite's dev server
- 🔧 **Zero Config**: Works out of the box with TypeScript
- 🎯 **Jest Compatible**: Same API as Jest for easy migration
- 📊 **Built-in Coverage**: V8 coverage with multiple reporters
- 🎨 **UI Interface**: Optional web UI for test debugging
- 🔍 **Watch Mode**: Smart re-running of affected tests

### Key Changes from Karma/Jasmine
- `function() {}` → `() => {}` (arrow functions)
- `jasmine.objectContaining()` → `expect.objectContaining()`
- `toThrowError()` → `toThrow()`
- Global `describe`, `it`, `expect` without imports

## Test Scripts

| Command | Description |
|---------|-------------|
| `yarn test` | Run tests once with linting |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:ui` | Open Vitest UI in browser |
| `yarn test:coverage` | Run tests with coverage report |
| `yarn test:coverage:ui` | Coverage with UI interface |
| `yarn test:coverage:detailed` | Detailed coverage with thresholds |
| `yarn test:coverage:html` | Generate and open HTML coverage |
| `yarn test:coverage:lcov` | Generate LCOV format for CI |
| `yarn test:ci` | CI-optimized run with JUnit output |

## Coverage Reports

### Coverage Thresholds
- **Global**: 85% minimum for branches, functions, lines, statements
- **Core Files**: 90% minimum for `gridstack.ts` and `gridstack-engine.ts`
- **Utils**: 85% minimum for `utils.ts`

### Coverage Formats
- **HTML**: Interactive browser report at `coverage/index.html`
- **LCOV**: For integration with CI tools and code coverage services
- **JSON**: Machine-readable format for automated processing
- **Text**: Terminal summary output
- **JUnit**: XML format for CI/CD pipelines

### Viewing Coverage
```bash
# Generate and view HTML coverage report
yarn test:coverage:html

# View coverage in terminal
yarn test:coverage

# Generate LCOV for external tools
yarn test:coverage:lcov
```

## Configuration Files

- **`vitest.config.ts`**: Main Vitest configuration
- **`vitest.setup.ts`**: Test environment setup and global mocks
- **`.vitestrc.coverage.ts`**: Enhanced coverage configuration
- **`tsconfig.json`**: TypeScript configuration with Vitest types

## Writing Tests

### Basic Test Structure
```typescript
import { Utils } from '../src/utils';

describe('Utils', () => {
  it('should parse boolean values correctly', () => {
    expect(Utils.toBool(true)).toBe(true);
    expect(Utils.toBool(false)).toBe(false);
    expect(Utils.toBool(1)).toBe(true);
    expect(Utils.toBool(0)).toBe(false);
  });
});
```

### DOM Testing
```typescript
describe('GridStack DOM', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="grid-stack"></div>';
  });

  it('should create grid element', () => {
    const grid = document.querySelector('.grid-stack');
    expect(grid).toBeInTheDocument();
  });
});
```

### Mocking
```typescript
// Mock a module
vi.mock('../src/utils', () => ({
  Utils: {
    toBool: vi.fn()
  }
}));

// Mock DOM APIs
Object.defineProperty(window, 'ResizeObserver', {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
  }))
});
```

## File Organization

```
spec/
├── utils-spec.ts           # Utils module tests
├── gridstack-spec.ts       # Main GridStack tests  
├── gridstack-engine-spec.ts # Engine logic tests
├── regression-spec.ts      # Regression tests
└── e2e/                   # End-to-end tests (not in coverage)
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests
  run: yarn test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Test Results
- **JUnit XML**: `coverage/junit-report.xml`
- **Coverage LCOV**: `coverage/lcov.info`
- **Coverage JSON**: `coverage/coverage-final.json`

## Debugging Tests

### VS Code Integration
1. Install "Vitest" extension
2. Run tests directly from editor
3. Set breakpoints and debug

### Browser UI
```bash
yarn test:ui
```
Opens a web interface for:
- Running individual tests
- Viewing test results
- Coverage visualization
- Real-time updates

## Performance

### Speed Comparison
- **Karma + Jasmine**: ~15-20 seconds
- **Vitest**: ~3-5 seconds
- **Watch Mode**: Sub-second re-runs

### Optimization Tips
- Use `vi.mock()` for heavy dependencies
- Prefer `toBe()` over `toEqual()` for primitives
- Group related tests in `describe` blocks
- Use `beforeEach`/`afterEach` for setup/cleanup

## Migration Notes

This project was migrated from Karma + Jasmine to Vitest with the following changes:

1. **Dependencies**: Removed karma-\* packages, added vitest + utilities
2. **Configuration**: Replaced `karma.conf.js` with `vitest.config.ts`
3. **Syntax**: Updated test syntax to modern ES6+ style
4. **Coverage**: Enhanced coverage with V8 provider and multiple formats
5. **Scripts**: New npm scripts for various testing workflows

All existing tests were preserved and converted to work with Vitest.
