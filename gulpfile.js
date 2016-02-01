var gulp = require('gulp')
var logwarn = require('gulp-logwarn')
var mocha = require('gulp-mocha-phantomjs')

gulp.task('logwarn', function scriptsLogwarnTask () {
  'use strict'

  return gulp.src('./isotip.js')
    .pipe(logwarn([
      'console.log',
      'console.error',
      'console.info',
      'debugger'
    ]))
})

gulp.task('mocha', function scriptsTestTask () {
  'use strict'

  return gulp.src('./test/index.html')
    .pipe(mocha({
      phantomjs: {
        viewportSize: {
          width: 1024,
          height: 768
        }
      }
    }))
})

gulp.task('default', [ 'logwarn', 'mocha' ])

gulp.task('test', [ 'logwarn', 'mocha' ])
