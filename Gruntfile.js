module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            name: 'TAP',
            version: '1.1.0',
            author: 'Indianapolis Museum of Art',
            banner: '/*\n' +
                ' * <%= meta.name %> - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * http://tapintomuseums.org/\n' +
                ' * Copyright (c) 2011-<%= grunt.template.today("yyyy") %> <%= meta.author %>\n' +
                ' * GPLv3\n' +
                ' */\n'
        },
        precompileTemplates: {
            dist : {
                src: ['templates/*.tpl.html'],
                dest: 'templates/CompiledTemplates.js'
            }
        },
        copy: {
            main: {
                files: [
                    {src: ['vendor/**'], dest: 'dist/'},
                    {src: ['images/**'], dest: 'dist/'}
                ]
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true,
                browser: true
            },
            globals: {
                define: true,
                requirejs: true,
                require: true,
                jQuery: true
            }
        },
        cssmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['css/main.css'],
                dest: 'dist/css/Tap-<%= meta.version %>.min.css'
            }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>.js': [
                        'js/tap/TapAPI.js',
                        'js/tap/Helper.js',
                        'js/tap/Router.js',
                        'js/tap/TemplateManager.js',
                        'js/tap/TourMLParser.js',
                        'js/tap/GeoLocation.js',
                        'templates/CompiledTemplates.js',
                        'js/tap/models/**/*.js',
                        'js/tap/collections/**/*.js',
                        'js/tap/views/BaseView.js',
                        'js/tap/views/StopSelectionView.js',
                        'js/tap/views/**/*.js',
                        'js/tap/JQMConfig.js'
                    ],
                    'dist/js/<%= pkg.name %>-<%= pkg.version %>-with-dependencies.js': [
                        'vendor/jquery.js',
                        'vendor/underscore.js',
                        'vendor/backbone.js',
                        'vendor/backbone-super.js',
                        'vendor/backbone.localstorage.js',
                        'vendor/json2.js',
                        'vendor/klass.js',
                        'vendor/leaflet/leaflet-src.js',
                        'vendor/mediaelement/mediaelement-and-player.js',
                        'vendor/photoswipe/code.photoswipe.jquery.js',
                        'js/tap/JQMConfig.js',
                        'vendor/jqmobile/jquery.mobile.js',
                        'js/tap/TapAPI.js',
                        'js/tap/Helper.js',
                        'js/tap/Router.js',
                        'js/tap/TemplateManager.js',
                        'js/tap/TourMLParser.js',
                        'js/tap/GeoLocation.js',
                        'templates/CompiledTemplates.js',
                        'js/tap/models/**/*.js',
                        'js/tap/collections/**/*.js',
                        'js/tap/views/BaseView.js',
                        'js/tap/views/StopSelectionView.js',
                        'js/tap/views/**/*.js'
                    ]
                }
            }
        }
    });

    //MultiTask for Compiling Underscore templates into a single file
    grunt.registerMultiTask('precompileTemplates', 'Precompile Underscore templates', function() {
        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                var src = grunt.file.read(filepath);
                // Process files as templates if requested.
                src = grunt.util._.template(src).source;

                var fileParts = filepath.split("\/");
                var fileName = fileParts[fileParts.length - 1];

                return "TapAPI.templates['" + fileName.substr(0,fileName.indexOf('.tpl.html')) + "'] = " + src;
            }).join(grunt.util.normalizelf(";\n\n"));

            // Write the destination file.
            grunt.file.write(f.dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task.
    grunt.registerTask('default', ['precompileTemplates', 'copy', 'jshint', 'concat', 'cssmin']);
};