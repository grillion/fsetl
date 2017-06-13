const gulp = require('gulp');
const pump = require('pump');
const jsHint = require('gulp-jshint');
const esLint = require('gulp-eslint');

const jsSourcePaths = [
  '*.js',
  'lib/**/*.js',
  'bin/**/*.js',
  'test/**/*.js'
];

/**
 * Prepare all JS
 */
gulp.task('js', function(cb) {
  pump([
    gulp.src(jsSourcePaths),
    jsHint(),
    jsHint.reporter('default'),
    jsHint.reporter('fail'),
    esLint(),
    esLint.format(),
    esLint.failAfterError(),
  ], cb);
});

gulp.task('js:watch', function(){
  gulp.watch( jsSourcePaths, ['js'] );
});