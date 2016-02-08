module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      // Your project's source files
      src : ['www/js/**/*.js', 'www/js/*.js'],
      options : {
        // Your Jasmine spec files
        specs : 'www/spec/tests/*.js',
        // Your spec helper files
        helpers : 'www/spec/helpers/*.js'
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