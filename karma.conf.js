// Karma configuration

module.exports = function(config) {
  config.set({

    // see https://www.npmjs.com/package/karma-typescript
    karmaTypescriptConfig: {
      compilerOptions: {
        lib: ['dom', 'es6'],
      },
      // bundlerOptions: {
      //   resolve: {
      //     alias: {
      //     }
      //   }
      // },
      exclude: ["demo", "dist/ng"], // ignore dummy demo .ts files
      include: [
        "./spec/**/*-spec.ts"
      ]
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.ts', // TODO: have to list files else the import in each won't be found!
      'spec/*-spec.ts',
      // 'spec/e2e/*-spec.js' issues with ReferenceError: `browser` & `element` is not defined
    ],
    // BUT list of files to exclude
    // exclude: [
    // ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'karma-typescript'],

    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/'
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadlessCustom'],
    customLaunchers: {
      ChromeHeadlessCustom: {
        base: 'ChromeHeadless',
        flags: ['--window-size=800,600']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    random: false,

    client: {
      jasmine: {
        random: false
      }
    }
  });
};
