module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-protractor-webdriver');

  const sass = require('sass');

  grunt.initConfig({
    sass: {
      options: {
        // precision: 3, // doesn't work
        implementation: sass,
			  sourceMap: false
      },
      dist: {
        files: {
          'dist/gridstack.css': 'src/gridstack.scss',
        }
      }
    },
    cssmin: {
      dist: {
        options: {
          sourceMap: false,
          keepSpecialComments: '*'
        },
        files: {
          'dist/gridstack.min.css': ['dist/gridstack.css'],
        }
      }
    },
    copy: {
      dist: {
        files: {
          'dist/src/gridstack.scss': ['src/gridstack.scss'],
          'dist/angular/README.md': ['angular/README.md'],
          'dist/angular/src/gridstack.component.ts': ['angular/projects/lib/src/lib/gridstack.component.ts'],
          'dist/angular/src/gridstack-item.component.ts': ['angular/projects/lib/src/lib/gridstack-item.component.ts'],
          'dist/angular/src/base-widget.ts': ['angular/projects/lib/src/lib/base-widget.ts'],
          'dist/angular/src/gridstack.module.ts': ['angular/projects/lib/src/lib/gridstack.module.ts'],
        }
      }
    },
    // uglify: {
    //   options: {
    //     sourceMap: true,
    //     output: {
    //       comments: 'some'
    //     }
    //   },
    //   dist: {
    //     files: {
    //     }
    //   }
    // },
    eslint: {
      target: ['*.js', 'src/*.js']
    },

    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['copy', 'uglify'],
        options: {
        },
      },
      styles: {
        files: ['src/*.scss'],
        tasks: ['sass', 'cssmin'],
        options: {
        },
      }
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js',
      },
      all: {}
    },

    connect: {
      all: {
        options: {
          port: 8080,
          hostname: 'localhost',
          base: '.',
        },
      },
    },

    // eslint-disable-next-line @typescript-eslint/camelcase
    protractor_webdriver: {
      all: {
        options: {
          command: 'webdriver-manager start',
        }
      }
    }
  });

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('default', ['sass', 'cssmin', /*'eslint',*/ 'copy', /*'uglify'*/]);
  grunt.registerTask('e2e-test', ['connect', 'protractor_webdriver', 'protractor']);
};
