/*global module:false, require:true, console:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-dox');

  var banner = [
        '/*! <%= pkg.name %> - v<%= pkg.version %> - ',
        '<%= grunt.template.today("yyyy-mm-dd") %> - <%= pkg.homepage %> */\n'
      ].join('');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      standardTarget: {
        options: {
          banner: banner
        },
        src: [
          'src/bezierizer.intro.js',
          'src/bezierizer.template.js',
          'src/bezierizer.core.js',
          'src/bezierizer.outro.js'
        ],
        dest: 'dist/bezierizer.js'
      }
    },
    uglify: {
      standardTarget: {
        files: {
          'dist/bezierizer.min.js': ['dist/bezierizer.js']
        }
      },
      options: {
        banner: banner
      }
    },
    jshint: {
      all_files: [
        'grunt.js',
        'src/bezierizer.!(intro|outro)*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    copy: {
      dist: {
        files: [
        {src: ['bower_components/jquery/jquery.js'], dest: 'dist/jquery.js'},
        {src: ['bower_components/jquery-dragon/src/jquery.dragon.js'], dest: 'dist/jquery.dragon.js'},
        {src: ['src/bezierizer.style.css'], dest: 'dist/bezierizer.style.css'}
        ]
      }
    },
    dox: {
      options: {
        title: 'Bezierizer'
      },
      files: {
        src: [
          'src/bezierizer.core.js'
        ],
        dest: 'dist/doc'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('build', [
      'copy:dist',
      'concat:standardTarget',
      'uglify:standardTarget',
      'dox']);

};
