module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['routes/*.js', 'spider/**/*.js', 'api/v1/*.js', 'app.js'],
        options: {
          livereload: true
        }
      }
    },

    nodemon: {
      dev: {
        script: './bin/www',
        options: {
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.option('force', true);

  grunt.registerTask('default', ['concurrent']);
}
