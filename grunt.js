/*global module:false*/
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
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
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/Tap-<%= meta.version %>.min.js'
			},
			dependencies: {
				src: ['<banner:meta.banner>', '<config:concat.dependencies.dest>'],
				dest: 'dist/Tap-<%= meta.version %>-dependencies.min.js'
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
				src: ['js/backbone/templates/*.tpl.html'],
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
		uglify: {}
	});

	//MultiTask for Compiling Underscore templates into a single file
	grunt.registerMultiTask('precompileTemplates', 'Precompile Underscore templates', function() {
		var files = grunt.file.expandFiles(this.file.src);

		var src = grunt.helper('precompileTemplates', files);
		grunt.file.write(this.file.dest, src);

		if (this.errorCount) { return false; }

		grunt.log.writeln('File "' + this.file.dest + '" created.');
	});

	// Helper for compiling Underscore templates
	grunt.registerHelper('precompileTemplates', function(files) {
		var output = '// TapAPI Namespace Initialization //\n' +
			'if (typeof TapAPI === "undefined"){TapAPI = {};}\n' +
			'if (typeof TapAPI.templates === "undefined"){TapAPI.templates = {};}\n' +
			'// TapAPI Namespace Initialization //\n';

		if (files) {
			output += files.map(function(filepath) {
				var templateHtml = grunt.task.directive(filepath, grunt.file.read),
					templateSrc = grunt.utils._.template(templateHtml).source,
					fileParts = filepath.split("\/"),
					fileName = fileParts[fileParts.length - 1];

				return "TapAPI.templates['" + fileName.substr(0,fileName.indexOf('.tpl.html')) + "'] = " + templateSrc;
			}).join('\n');
		}

		return output;
	});

	grunt.loadNpmTasks('grunt-css');

	// Default task.
	grunt.registerTask('default', 'precompileTemplates concat min cssmin');

};
