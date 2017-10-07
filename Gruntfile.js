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

    grunt.initConfig({
        sass: {
            options: {
                outputStyle: 'expanded'
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
                    'dist/gridstack.jQueryUI.js': ['src/gridstack.jQueryUI.js'],
                }
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'dist/gridstack.min.map',
                preserveComments: 'some'
            },
            dist: {
                files: {
                    'dist/gridstack.min.js': ['src/gridstack.js'],
                    'dist/gridstack.jQueryUI.min.js': ['src/gridstack.jQueryUI.js'],
                    'dist/gridstack.all.js': ['src/gridstack.js', 'src/gridstack.jQueryUI.js']
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
