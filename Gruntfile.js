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
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'js/Main.js',
                    optimize: 'uglify',
                    skipDirOptimize: true,
                    optimizeCss: 'none',
                    name: 'main',
                    excludeShallow: [
                        'Config'
                    ],
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
                    out: 'dist/js/tap/Main.js',
                    wrap: {
                        start: '<%= meta.banner %>'
                    }
                }
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

            // wrap the templates inside of a module
            var templateDoc = 'define(["tap/TapAPI"], function (TapAPI) {';
                templateDoc += src;
                templateDoc += '});';

            // Write the destination file.
            grunt.file.write(f.dest, templateDoc);

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-css');

    // Default task.
    grunt.registerTask('default', ['precompileTemplates', 'copy', 'jshint', 'requirejs', 'cssmin']);
};