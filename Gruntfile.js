module.exports = function(grunt) {
  grunt.initConfig({
    mochaTest: {
      files: ['test/**/*.js']
    },
    mochaTestConfig: {
      options: {
        reporter: 'spec',
        timeout: 2000,
        globals: ['should']
      }
    },
    jshint: {
      files: ['*.js', 'routes/**/*.js', '<%= mochaTest.files %>'],
      options: {
        jshintrc: 'test/.gruntjshintrc',
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint', 'mochaTest']);
  grunt.registerTask('tests', ['mochaTest']);
};