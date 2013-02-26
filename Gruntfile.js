module.exports = function(grunt) {
	var precompileTemplates;

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			name: 'TAP',
			version: '0.1.0',
			author: 'Indianapolis Museum of Art',
			banner: '/*\n' +
				' * <%= meta.name %> - v<%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * http://tapintomuseums.org/\n' +
				' * Copyright (c) 2011-<%= grunt.template.today("yyyy") %> <%= meta.author %>\n' +
				' * GPLv3\n' +
				' */'
		},
		lint: {
			files: ['grunt.js', 'js/backbone/**/*.js']
		},
		concat: {
			dist: {
				src: [
					'<banner:meta.banner>',
					'js/AnalyticsTimer.js',
					'js/backbone/helper.js',
					'js/backbone/models/**/(PropertyModel|SourceModel|ContentModel).js',
					'js/backbone/models/**/*.js',
					'js/backbone/collections/**/(PropertySetCollection|SourceCollection|ContentCollection).js',
					'js/backbone/collections/**/*.js',
					'js/backbone/views/HelperView.js',
					'js/backbone/views/BaseView.js',
					'js/backbone/views/StopView.js',
					'js/backbone/views/**/!(GalleryView|GeoStop|ObjectStop|WebStop)*.js',
					'js/backbone/Router.js',
					'js/backbone/Init.js',
					'js/backbone/GeoLocation.js',
					'js/backbone/Tap.js',
					'js/backbone/TemplateManager.js',
					'js/backbone/templates/CompiledTemplates.js'
				],
				dest: 'dist/Tap-<%= meta.version %>.js'
			},
			dependencies: {
				src: [
					'external/json2.js',
					'external/jquery-1.8.3.js',
					'js/backbone/jqm-config.js',
					'external/underscore-1.4.3.js',
					'external/jqmobile/jquery.mobile-1.3.0.js',
					'external/backbone-0.9.9.js',
					'external/backbone-super.js',
					'external/backbone.localStorage-min.js',
					'external/klass.js',
					'external/leaflet/leaflet.js',
					'external/mediaelement/mediaelement-and-player.js',
					'external/photoswipe/code.photoswipe.jquery-3.0.4.js'
				],
				dest: 'dist/Tap-<%= meta.version %>-dependencies.js'
			},
			css: {
				src: [
					'<banner:meta.banner>',
					'external/jqmobile/jquery.mobile-1.3.0.css',
					'external/leaflet/leaflet.css',
					'external/mediaelement/mediaelementplayer.css',
					'external/photoswipe/photoswipe.css',
					'css/tapweb.css'
				],
				dest: 'dist/Tap-<%= meta.version %>.css'
			}
		},
		cssmin: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.css.dest>'],
				dest: 'dist/Tap-<%= meta.version %>.min.css'
			}
		},
		watch: {
			files: '<config:lint.files>',
			tasks: 'concat min'
		},
		precompileTemplates: {
			dist : {
				src: ['templates/*.tpl.html'],
				dest: 'js/backbone/templates/CompiledTemplates.js'
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
				jQuery: true
			}
		},
		uglify: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/Tap-<%= meta.version %>.min.js'
			},
			dependencies: {
				src: ['<banner:meta.banner>', '<config:concat.dependencies.dest>'],
				dest: 'dist/Tap-<%= meta.version %>-dependencies.min.js'
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "./",
					mainConfigFile: "js/Main.js",
					out: ""
				}
			}
		}
	});

	// load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
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
	grunt.registerTask('default', ['precompileTemplates', 'jshint', 'concat', 'uglify', 'cssmin']);
};