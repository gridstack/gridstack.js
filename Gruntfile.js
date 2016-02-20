module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-doctoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');

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
                    'dist/gridstack.js': ['src/gridstack.js']
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
                    'dist/gridstack.min.js': ['src/gridstack.js']
                }
            }
        },

        doctoc: {
            options: {
                removeAd: false
            },
            readme: {
                options: {
                    target: './README.md'
                }
            },
            doc: {
                options: {
                    target: './doc/README.md'
                }
            },
        },

        jshint: {
            all: ['src/*.js']
        },

        jscs: {
            all: ['*.js', 'src/*.js', ],
        },
    });

    grunt.registerTask('default', ['sass', 'cssmin', 'copy', 'uglify', 'doctoc', 'jshint', 'jscs']);
};
