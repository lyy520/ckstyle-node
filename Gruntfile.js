/*
   package.json config
   npm install
   grunt
 */

module.exports = function(grunt) {

  var fs = require('fs');
  // Project configuration.
  var banner = '// auto generated by concat \n;define(\'${path}\', function(require, exports, module) {\n\n',
      footer = '\n})',
      separator = footer + '\n\n' + banner;
  var plugins = [];

  require('load-grunt-tasks')(grunt, {
    pattern: 'grunt-contrib-*'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
        files: ['ckstyle/**/*.js'],
        tasks: ['copy']
    },
    copy: {
      ckservice: {
        src: ['dist/ckservice.min.js', 'dist/ckservice.js'],
        dest:'../ckstyle.github.io/js/'
      },
      ckstyle: {
        src: [
          'ckstyle/entity/**/*.js',
          'ckstyle/parser/**/*.js',
          'ckstyle/browsers/**/*.js', 
          'ckstyle/plugins/**/*.js',
          'ckstyle/reporter/**/*.js',
          'ckstyle/command/**/*.js',
          'ckstyle/*.js'
        ],
        dest: 'dist/',
        flatten: true,
        options: {
          processContent: function(src, filepath) {
            // index.js 会出现在所有plugins之后
            if (filepath == 'ckstyle/plugins/index.js') {
              var src = '';
              plugins.forEach(function(p) {
                p = p.replace(/\.js$/, '');
                src += 'exports.' + p + ' = require(\'./' + p + '\'); \n';
              });
            }
            var splited = filepath.split('/');
            if (splited.length > 2) {
              var plugin = splited[splited.length - 1];
              if (plugin.indexOf('FED') == 0) {
                plugins.push(plugin);
              }
            }
            var code = '';
            var code = code + banner.replace('${path}', filepath.replace(/\.js$/, ''));

            code = code + src.trim() + '\n' + footer;
            return code;
          }
        }
      },
    },
    concat: {
      ckstyle: {
        src: ['dist/ckstyle/**/*.js', 'compatible/*.js'],
        dest: 'dist/<%= pkg.name %>.js'  
      },
      ckservice: {
        src: [
          'ckservice/libs/jquery.js', 
          'ckservice/libs/mustache.js', 
          'ckservice/libs/sea.js', 
          'ckservice/libs/difflib/difflib.js', 
          'ckservice/libs/difflib/diffview.js', 
          '<%= concat.ckstyle.dest %>',
          'ckservice/main.js'
        ],
        dest: 'dist/ckservice.js'
      }
    },
    clean: {
      all: ["dist/ckstyle", "dist/ckstyle.js", "dist/ckstyle.min.js"],
      dir: ["dist/ckstyle"]
    },
    uglify: {
      ckstyle: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.ckstyle.dest %>']  
        }
      },
      ckservice: {
        options: {
          banner: '/*! ckservice <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'dist/ckservice.min.js': ['<%= concat.ckservice.dest %>']  
        }
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-clean');
  // grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', [
    'clean:all', 
    'copy:ckstyle', 'concat:ckstyle', 'clean:dir', 'uglify:ckstyle', 
    'concat:ckservice', 'uglify:ckservice'
  ]);
  grunt.registerTask('dev', ['watch']);
  grunt.registerTask('dist', ['copy:ckservice'])
};