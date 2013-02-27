module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            name: 'TAP',
            version: '1.0.0',
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
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'js/Main.js',
                    dir: 'dist/',
                    optimize: 'uglify',
                    skipDirOptimize: true,
                    optimizeCss: 'none',
                    removeCombined: false,
                    name: 'main',
                    include: [
                        'tap/views/AudioStopView',
                        'tap/views/ImageStopView',
                        'tap/views/KeypadView',
                        'tap/views/MapView',
                        'tap/views/StopGroupView',
                        'tap/views/StopListView',
                        'tap/views/StopSelectionView',
                        'tap/views/VideoStopView',
                        'tap/views/WebView',
                        '../templates/CompiledTemplates'
                    ],
                    exclude: [
                        'jquery',
                        'jquerymobile',
                        'json2',
                        'underscore',
                        'backbone',
                        'localStorage',
                        'backbone-super',
                        'mediaelement',
                        'leaflet',
                        'klass',
                        'photoswipe',
                        'jqm-config',
                        'tap/Config'
                    ]
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= meta.banner %>'
            },
            dependencies: {
                src: [
                    'js/vendor/jquery.js',
                    'js/tap/JQMConfig.js',
                    'js/vendor/jqmobile/jquery.mobile.js',
                    'js/vendor/json2.js',
                    'js/vendor/underscore.js',
                    'js/vendor/backbone.js',
                    'js/vendor/backbone.localStorage.js',
                    'js/vendor/backbone-super.js',
                    'js/vendor/leaflet/leaflet.js',
                    'js/vendor/klass.js',
                    'js/vendor/photoswipe/code.photoswipe.jquery.js',
                    'js/vendor/mediaelement/mediaelement-and-player.js'
                ],
                dest: 'dist/Tap-<%= meta.version %>-dependencies.js'
            },
            css: {
                src: [
                    'js/vendor/jqmobile/jquery.mobile.css',
                    'js/vendor/leaflet/leaflet.css',
                    'js/vendor/mediaelement/mediaelementplayer.css',
                    'js/vendor/photoswipe/photoswipe.css',
                    'css/main.css'
                ],
                dest: 'dist/Tap-<%= meta.version %>.css'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dependencies: {
                files: {
                    'dist/Tap-<%= meta.version %>-dependencies.min.js': ['<%= concat.dependencies.dest %>']
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.css.dest %>'],
                dest: 'dist/Tap-<%= meta.version %>.min.css'
            }
        }
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-css');

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

    // Default task.
    grunt.registerTask('default', ['precompileTemplates', 'jshint', 'requirejs', 'concat', 'uglify', 'cssmin']);
};