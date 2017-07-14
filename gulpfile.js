// Defining base pathes
var basePaths = {
    bower: './bower_components/',
    src: './src/'
};

// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');

// Run: 
// gulp watch
// Starts watcher. Watcher runs appropriate tasks on file changes
gulp.task('watch', function () {
  gulp.watch('./src/**/*.js', ['build-scripts']);
});

// Run: 
// gulp
// Defines gulp default task
gulp.task('default', ['watch'], function () { });

// Run: 
// gulp build-scripts. 
// Uglifies and concat all JS files into one
gulp.task('build-scripts', function() {
  var src = [
      basePaths.src + 'smooth-parallax.js'
    ];

  // compiled (.js)
  gulp.src(src)
    .pipe(concat('smooth-parallax.js'))
    .pipe(gulp.dest('./dist/'));

  // compiled (.min.js)
  gulp.src(src)
    .pipe(concat('smooth-parallax.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest('./dist/'));

});
