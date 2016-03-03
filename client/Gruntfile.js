module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      coverage: {
        // Your project's source files
        src : ['www/js/**/*.js', 'www/js/utility.js', 'www/js/*.js', 'www/spec/helpers/*.js'],
        options : {
          // Your Jasmine spec files
          specs : 'www/spec/tests/*.js',
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            files: ['www/js/*.js', 'www/js/ui/*.js'],
            coverage: 'bin/coverage/coverage.json',
            report: 'bin/coverage',
            // thresholds: {
            //     lines: 75,
            //     statements: 75,
            //     branches: 75,
            //     functions: 90
            // }
          }
        }
      }
    },
    shell: {
      options: {
        stderr: false
      },
      target: {
        command: 'cordova build android'
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'www/js/**/*.js', 'www/js/*.js', '!www/js/lib/*.js', '../server/server.js'],
      // options: {
      //   globals: {
      //     "$": false,
      //     "Calculator": false,
      //     "DataManager": false,
      //     "NetworkManager": false,
      //     "NotificationManager": false,
      //     "StorageManager": false,
      //     "UIController": false,
      //     "UIView": false
      //   }
      // }
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint', 'jasmine', 'shell']);
  grunt.registerTask('build', 'shell');
};