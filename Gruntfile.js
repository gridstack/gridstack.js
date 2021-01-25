module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-protractor-webdriver');

  const sass = require('node-sass');

  grunt.initConfig({
    sass: {
      options: {
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
          'dist/gridstack-poly.js': ['src/gridstack-poly.js'],
          'dist/src/gridstack.scss': ['src/gridstack.scss'],
          'dist/src/gridstack-extra.scss': ['src/gridstack-extra.scss'],
        }
      }
    },
    uglify: {
      options: {
        sourceMap: true,
        output: {
          comments: 'some'
        }
      },
      dist: {
        files: {
          'dist/jq/jquery.js': 'src/jq/jquery.js',
          'dist/jq/jquery-ui.js': 'src/jq/jquery-ui.js',
          'dist/jq/jquery.ui.touch-punch.js': 'src/jq/jquery.ui.touch-punch.js',
        }
      }
    },
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
  grunt.registerTask('default', ['sass', 'cssmin', /*'eslint',*/ 'copy', 'uglify']);
  grunt.registerTask('e2e-test', ['connect', 'protractor_webdriver', 'protractor']);
};
