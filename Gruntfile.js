// jshint node:true
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.initConfig({
        sass: {
            dist: {
                options: {
                    outputStyle: 'expanded'
                },

                files: {
                    'marionette.modal.css': 'scss/marionette.modal.scss'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'marionette.modal.min.js': 'marionette.modal.js',
                    'polyfill.classlist.min.js': 'polyfill.classlist.js'
                }
            }
        },

        jscs: {
            src: '*[^min].js',

            options: {
                config: '.jscsrc'
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },

            files: '*[^min].js'
        }
    });

    grunt.registerTask('lint', ['jscs', 'jshint']);
    grunt.registerTask('default', ['sass', 'uglify']);
};
