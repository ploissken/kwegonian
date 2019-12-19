const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

gulp.task('serve', function () {
  var server = nodemon({
    script: 'index.js',
    ext: 'js',
    legacyWatch: true // necessary for windows environment
  })

  server.on('restart', function () {
    console.log('NodeJS restarted!')
  }).on('crash', function () {
    console.error('NodeJS has crashed!')
    // Restart the server in 5 seconds
    server.emit('restart', 5)
  })
})
