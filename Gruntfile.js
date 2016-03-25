module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            my_target: {
                files: {
                    'dev/form-validate.min.js': 'dev/form-validate.js'
                }
            }
        },
        //        copy: {
        //            main: {
        //                files: [
        //                    {
        //                        expand: false,
        //                        flatten: true,
        //                        src: 'dev/**/form-validate.min.js',
        //                        dest: 'demo/js/*'
        //                    }
        //                ]
        //            }
        //        },
        rename: {
            main: {
                files: [
                    {
                        src: ['dev/form-validate.min.js'],
                        dest: 'demo/js/form-validate.min.js'
                    },
                ]
            }
        },
        watch: {
            scripts: {
                files: ['dev/form-validate.js'],
                tasks: ['uglify', 'rename'],
                options: {
                    spawn: false,
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    //    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['watch']);
};