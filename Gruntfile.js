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
          'dist/gridstack-extra.css': 'src/gridstack-extra.scss'
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
          'dist/gridstack-extra.min.css': ['dist/gridstack-extra.css']
        }
      }
    },
    copy: {
      dist: {
        files: {
          'dist/es5/gridstack-poly.js': ['src/gridstack-poly.js'],
          'dist/src/gridstack.scss': ['src/gridstack.scss'],
          'dist/src/gridstack-extra.scss': ['src/gridstack-extra.scss'],
          'dist/ng/README.md': ['demo/angular/src/app/README.md'],
          // 'dist/ng/gridstack.component.ts': ['demo/angular/src/app/gridstack.component.ts'],
          // 'dist/ng/gridstack-item.component.ts': ['demo/angular/src/app/gridstack-item.component.ts'],
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
