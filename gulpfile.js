var gulp = require( 'gulp' ),
    logwarn = require( 'gulp-logwarn' ),
    jshint = require( 'gulp-jshint' ),
    jscs = require( 'gulp-jscs' ),
    uglify = require( 'gulp-uglify' ),
    browserify = require( 'browserify' );

gulp.task( 'logwarn', function() {
    return gulp.src( 'tooltip.js' )
        .pipe( logwarn());
});

gulp.task( 'jscs', function() {
    return gulp.src( 'tooltip.js' )
        .pipe( jscs());
});

gulp.task( 'jshint', function() {
    return gulp.src( 'tooltip.js' )
        .pipe( jshint())
        .pipe( jshint.reporter( 'default' ))
        .pipe( jshint.reporter( 'fail' ));
});

gulp.task( 'default', [ 'logwarn', 'jscs', 'jshint' ]);

gulp.task( 'test', [ 'logwarn', 'jscs', 'jshint' ]);

