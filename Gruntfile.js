'use strict';

// Wrapper function
module.exports = function(grunt) {
	/*
		Project and task configuration.
		Configure new plug‐in by adding a new property matching the plug‐in name to initConfig. 
	*/
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/*
			Configuring the 'connect' task from 'grunt-contrib-connect'.
			Sets up a lightweight Node.js server for local development purposes.
			Also uses a connect‐livereload plug‐in which enables real-time page updates.
			Note: target options override task options. 

		*/
		connect: {
			// Task options, overrides built-in defaults
			options: {
				port: 9000,
				open: true,
				livereload: 35729,
				hostname: 'localhost'
			},
			// Arbitrarily named target
			dev: {
				// Target options, overrides task options
				options: {
					middleware: function() {
						var serveStatic = require('serve-static');
						return [ serveStatic('app') ];
					}
				}
			}
		},

		/* Configuring the 'less' task from 'grunt-contrib-less' */
		less: {
			dev: {
				files: {
					'app/main.css': 'app/main.less'
				}
			}
		},

		/* Configuring the 'jshint' task from 'grunt-contrib-jshint' */
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'app/*.js'
			]
		},

		/* Configuring the 'watch' task from 'grunt-contrib-watch' */
		watch: {
			options: {
				livereload: '<%= connect.options.livereload %>',
			},
			js: {
				files: ['app/*.js'],
				tasks: ['jshint']
			},
			styles: {
				files: ['app/*.less'],
				tasks: ['less']
			},
			html: {
				files: ['app/*.html']
			}
		}
	});

	// Automatically loads all plug-in tasks from package.json 
	require('load-grunt-tasks')(grunt);

	// Default task
	grunt.registerTask('default', ['connect:dev', 'watch']);

	/*
		Custom task.
		Accepts 2 params: one and two.
		Usage example: grunt myTask:Hello:Grunt
	*/
	grunt.registerTask('myTask', 'My custom task', function(one, two) {
		
		// Force task to run in async mode and save handle for completion callback
		var done = this.async();
		setTimeout(function() {
			// Access task name and arguments
			grunt.log.writeln(this.name, one, two);

			// Fail if properties don't exist
			grunt.config.requires('connect.options.livereload');

			// Access configuration properties
			grunt.log.writeln('The livereload port is ' + grunt.config('connect.options.livereload'));

			// Succeed asynchronously
			done();
			// Run other tasks
			grunt.task.run('default');
		}.bind(this), 1000);
	});
};