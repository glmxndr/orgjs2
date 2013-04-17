module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'lib/src/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          module: true
        }
      }
    },
    browserify: {
      orgjs:{
        src: ['lib/src/core.js'],
        dest: 'dist/orgjs.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/orgjs.min.js': ['dist/orgjs.js']
        }
      }
    },
    "jasmine-node": {
      options: {
        coffee: true
      },
      run: {
        spec: "lib/spec"
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine-node');

  // this would be run by typing "grunt test" on the command line
  grunt.registerTask('test', ['jshint', 'jasmine-node']);

  // the default task can be run just by typing "grunt" on the command line
  grunt.registerTask('default', ['jshint', 'jasmine-node', 'browserify', 'uglify']);

};