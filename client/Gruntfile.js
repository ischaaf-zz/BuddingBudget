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
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-shell');

  // Default task.
  grunt.registerTask('default', ['jasmine', 'shell']);
  grunt.registerTask('build', 'shell');
};