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
					'js/backbone/helper.js',
					'js/backbone/models/**/*.js',
					'js/backbone/collections/**/*.js',
					'js/backbone/views/HelperView.js',
					'js/backbone/views/**/*.js',
					'js/backbone/Router.js',
					'js/backbone/Init.js',
					'js/backbone/Tap.js',
					'js/backbone/TemplateManager.js',
					'js/backbone/templates/CompiledTemplates.js'
				],
				dest: 'dist/Tap-<%= meta.version %>.js'
			},
			dependencies: {
				src: [
					'js/external/json2.js',
					'js/external/jquery-1.7.2.js',
					'js/external/jquery.mobile-1.1.0.js',
					'js/external/underscore-1.3.3.js',
					'js/external/backbone-0.9.2.js',
					'js/external/backbone.localStorage-min.js',
					'js/external/klass.min.js',
					'js/external/code.photoswipe.jquery-3.0.4.js',
					'external/leaflet/leaflet.js'
				],
				dest: 'dist/Tap-<%= meta.version %>-dependencies.js'
			},
			css: {
				src: [
					'<banner:meta.banner>',
					'css/jquery.mobile-1.1.0.css',
					'css/tapweb.css',
					'css/photoswipe.css',
					'external/leaflet/leaflet.css'
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

				grunt.log.writeln('template:');
				grunt.log.write(templateHtml);
				grunt.log.writeln('templated:');
				grunt.log.write(grunt.utils._.template(templateHtml));
				grunt.log.writeln('source:');
				grunt.log.write(templateSrc);

				return "TapAPI.templates['" + fileName.substr(0,fileName.indexOf('.tpl.html')) + "'] = " + templateSrc;
			}).join('\n');
		}

		return output;
	});

	//grunt.loadNpmTasks('/usr/local/lib/node_modules/grunt/node_modules/grunt-css');
	grunt.loadNpmTasks('/usr/local/lib/node_modules/grunt-css');

	// Default task.
	grunt.registerTask('default', 'precompileTemplates concat min cssmin');

};
