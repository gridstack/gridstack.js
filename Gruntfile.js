/*eslint-disable camelcase */
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
			  sourceMap: true
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
          'dist/gridstack.js': ['src/gridstack.js'],
          'dist/gridstack.d.ts': ['src/gridstack.d.ts'],
          'dist/gridstack.jQueryUI.js': ['src/gridstack.jQueryUI.js'],
          'dist/gridstack-poly.js': ['src/gridstack-poly.js'],
          'dist/jquery.js': ['src/jquery.js'],
          'dist/jquery-ui.js': ['src/jquery-ui.js'],
          'dist/src/gridstack.scss': ['src/gridstack.scss'],
          'dist/src/gridstack-extra.scss': ['src/gridstack-extra.scss'],
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: 'dist/gridstack.min.map',
        output: {
          comments: 'some'
        }
      },
      dist: {
        files: {
          'dist/gridstack.min.js': ['src/gridstack.js'],
          'dist/gridstack.jQueryUI.min.js': ['src/gridstack.jQueryUI.js'],
          'dist/gridstack-poly.min.js': ['src/gridstack-poly.js'],
          'dist/jquery.min.js': ['src/jquery.js'],
          'dist/jquery-ui.min.js': ['src/jquery-ui.js'],
          'dist/gridstack.all.js': ['src/gridstack-poly.js', 'src/jquery.js', 'src/gridstack.js', 'src/jquery-ui.js', 'src/gridstack.jQueryUI.js']
        }
      }
    },

    eslint: {
      target: ['*.js', 'src/*.js']
    },

    watch: {
      scripts: {
        files: ['src/*.js'],
        tasks: ['uglify', 'copy'],
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

    protractor_webdriver: {
      all: {
        options: {
          command: 'webdriver-manager start',
        }
      }
    }
  });

  grunt.registerTask('lint', ['eslint']);
  grunt.registerTask('default', ['sass', 'cssmin', 'eslint', 'copy', 'uglify']);
  grunt.registerTask('e2e-test', ['connect', 'protractor_webdriver', 'protractor']);
};
/*eslint-enable camelcase */