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

    coffeeify: {
      options: {
        debug: false,
        requires: []
      },
      test: {
        files: [
          {
            src:['lib/src/**/*.js', 'lib/spec/**/*.coffee'], 
            dest:'test/all.js'
          }
        ]
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
        coffee: true,
        noStack: true
      },
      run: {
        spec: "lib/spec"
      }
    },
    exec: {
      test: {
        cmd: 'node ./node_modules/jasmine-node/bin/jasmine-node --coffee --noStack ./lib/spec/'
      },
      testStack: {
        cmd: 'node ./node_modules/jasmine-node/bin/jasmine-node --coffee ./lib/spec/'
      },
      debug: {
        cmd: 'node --debug-brk ./node_modules/jasmine-node/bin/jasmine-node --coffee --noStack ./lib/spec/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine-node');
  grunt.loadNpmTasks('grunt-coffeeify');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['jshint', 'coffeeify:test', 'exec:test']);
  grunt.registerTask('testStack', ['jshint', 'coffeeify:test', 'exec:testStack']);
  grunt.registerTask('default', ['jshint', 'coffeeify:test', 'jasmine-node', 'browserify', 'uglify']);

};
