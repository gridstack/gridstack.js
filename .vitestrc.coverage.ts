/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

// Enhanced coverage configuration
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    
    include: [
      'spec/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/angular/**',
      '**/react/**',
      '**/demo/**'
    ],

    // Enhanced coverage configuration for detailed reporting
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'text-summary', 
        'json',
        'json-summary',
        'html',
        'lcov',
        'clover',
        'cobertura'
      ],
      
      // Comprehensive exclusion patterns
      exclude: [
        'coverage/**',
        'dist/**',
        'node_modules/**',
        'demo/**',
        'angular/**',
        'react/**',
        'scripts/**',
        'spec/e2e/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/karma.conf.js',
        '**/vitest.config.ts',
        '**/vitest.setup.ts',
        '**/webpack.config.js',
        '**/Gruntfile.js',
        '**/*.min.js',
        '**/test.html'
      ],
      
      // Include all source files for coverage analysis
      all: true,
      include: ['src/**/*.{js,ts}'],
      
      // Strict coverage thresholds
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        },
        // Per-file thresholds for critical files
        'src/gridstack.ts': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/gridstack-engine.ts': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        },
        'src/utils.ts': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      },
      
      // Coverage report directory
      reportsDirectory: './coverage',
      
      // Enable branch coverage
      reportOnFailure: true,
      
      // Clean coverage directory before each run
      clean: true,
      
      // Skip files with no coverage
      skipFull: false,
      
      // Enable source map support for accurate line mapping
      allowExternal: false,
      
      // Watermarks for coverage coloring
      watermarks: {
        statements: [50, 80],
        functions: [50, 80], 
        branches: [50, 80],
        lines: [50, 80]
      }
    },

    // Enhanced reporter configuration
    reporter: [
      'verbose',
      'html',
      'json',
      'junit'
    ],

    // Output files for CI/CD integration
    outputFile: {
      html: './coverage/test-results.html',
      json: './coverage/test-results.json',
      junit: './coverage/junit-report.xml'
    }
  }
})
