/*global module:false, require:true, console:true */
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-dox');
  grunt.loadNpmTasks('grunt-bump');

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
        {src: ['bower_components/shifty/dist/shifty.js'], dest: 'dist/shifty.js'}
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
    },
    compass: {
      options: {
        sassDir: 'src',
        cssDir: 'dist',
        environment: 'production'
      },
      dist: {}
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: false,
        createTag: false,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit']);
  grunt.registerTask('build', [
      'copy:dist',
      'concat:standardTarget',
      'uglify:standardTarget',
      'compass:dist',
      'dox']);

};
