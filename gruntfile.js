var path = require('path');

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {});

    grunt.initConfig({
		connect: {
			server: {
				options: {
					port: 9001,
					base: '.'
				}
			}
		}
    });

};