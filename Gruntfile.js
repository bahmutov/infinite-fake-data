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

    // make sure index.html example works inside destination folder
    copy: {
      all: {
        files: [
          {
            expand: true,
            src: [
              'lib/*.js',
              'infinite-fake-data.js',
              'bower_components/jquery/dist/jquery.min.js',
              'bower_components/angular/angular.js',
              'bower_components/angular-mocks/angular-mocks.js',
              'index.html',
              'README.md'
            ],
            dest: '<%= destination_dir %>'
          }
        ]
      }
    },

    watch: {
      all: {
        options: {
          livereload: 35729
        },
        files: ['*.js', 'index.html'],
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
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-mocks/angular-mocks.js'
      ]
    }
  };
  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  grunt.registerTask('build', ['bower', 'clean', 'copy']);
  grunt.registerTask('default', ['build']);
};
