/* global module, require */
module.exports = function (grunt) {
  'use strict';

  var pkg = grunt.file.readJSON('package.json');

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  var userConfig = {
    destination_dir: 'dist'
  };

  var taskConfig = {

    pkg: pkg,

    clean: ['<%= destination_dir %>/bower_components'],

    bower: {
      install: {
        options: {
          layout: 'byComponent',
          // if copy is false, will leave all downloaded files in bower_components
          copy: false,
          verbose: true,
          cleanBowerDir: false,
          bowerOptions: {
            forceLatest: true
          }
        }
      }
    },

    'clean-console': {
      all: {
        options: {
          url: 'dist/index.html',
          timeout: 1 // seconds to wait for any errors
        }
      }
    },

    browserify: {
      options: {
        transform: ['6to5ify']
      },
      'dist/src/app.js': 'src/*.es6'
    },

    // make sure index.html example works inside destination folder
    copy: {
      index: {
        files: {
          '<%= destination_dir %>/index.html': 'src/index.html'
        }
      },
      all: {
        files: [{
          expand: true,
          src: [
            'lib/*.js',
            'bower_components/es5-shim/es5-shim.js',
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-loading-bar/build/loading-bar.min.js',
            'bower_components/angular-loading-bar/build/loading-bar.min.css',
            'README.md'
          ],
          dest: '<%= destination_dir %>'
        }]
      }
    },

    watch: {
      all: {
        options: {
          livereload: 35729
        },
        files: ['src/*.es6', 'src/index.html', '*.js'],
        tasks: ['build']
      }
    },

    'gh-pages': {
      options: {
        base: '<%= destination_dir %>'
      },
      src: [
        'index.html',
        'README.md',
        '*.js',
        'lib/*.js',
        'src/*.js',
        'bower_components/es5-shim/es5-shim.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/angular-loading-bar/build/loading-bar.min.js',
        'bower_components/angular-loading-bar/build/loading-bar.min.css'
      ]
    }
  };
  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask('build', ['bower', 'clean', 'browserify', 'copy', 'clean-console']);
  grunt.registerTask('default', ['nice-package', 'sync', 'build']);
};
