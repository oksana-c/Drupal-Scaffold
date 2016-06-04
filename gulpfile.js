/**
 * @file
 *  Gulp task definitions for the project.
 *
 */
/* eslint-env node */
'use strict';

var gulp = require('gulp-help')(require('gulp'));
var exec = require('child-process-promise').exec;
var phpcs = require('gulp-phpcs');
var eslint = require('gulp-eslint');
var phplint = require('gulp-phplint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var mergeStream = require('merge-stream');

// Load in configuration.  You don't have to use this,
// but it makes it easier to update tasks in the future
// if paths aren't scattered in the gulpfile.
var config = require('./gulpconfig');


function mergeSources(arr) {
  var srcArr = [];
  for (var i = 0; i < arr.length; i++) {
    srcArr = srcArr.concat(arr[i].src);
  }
  return srcArr;
}

/**
 * Install tasks
 *
 * Add steps here to run during installation of the app.
 */
gulp.task('install', 'Run all install steps', ['install:composer', 'install:bower']);
gulp.task('install:composer', 'Run composer install', function (cb) {
  return exec('composer install');
});
gulp.task('install:bower', 'Run bower install', function () {
  var bower = __dirname + '/node_modules/.bin/bower';
  return exec(bower + ' install', {
    cwd: config.bowerJsonDirectory
  });
});


/**
 * Check tasks
 *
 * Add steps here to run during checking/testing of the app.
 */
gulp.task('check', 'Run static code analysis', ['check:phpcs', 'check:eslint']);
gulp.task('check:phplint', 'Lint PHP code', function () {
  return gulp.src(config.phpCheck)
    .pipe(phplint())
    .pipe(phplint.reporter('fail'));
});
gulp.task('check:phpcs', 'Check Drupal code style', function () {
  return gulp.src(config.phpCheck)
    .pipe(phpcs({
      bin: 'vendor/bin/phpcs',
      standard: 'vendor/drupal/coder/coder_sniffer/Drupal'
    }))
    .pipe(phpcs.reporter('log'))
    .pipe(phpcs.reporter('fail'));
});
gulp.task('check:eslint', 'Check JS style', function () {
  return gulp
    .src(config.jsCheck)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

/**
 * Build tasks
 *
 * Add steps here to run during the app build process.
 */
gulp.task('build', 'Run all build steps.', ['build:scss', 'build:js']);
gulp.task('build:watch', 'Run build steps and watch for changes', ['build:scss', 'build:js'], function () {
  gulp.watch(mergeSources(config.js), ['build:js']);
  gulp.watch(mergeSources(config.scss), ['build:scss']);
});
gulp.task('build:scss', 'Build SCSS files', function () {
  var streams = mergeStream();
  config.scss.forEach(function (pack) {
    var stream = gulp
      .src(pack.src)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(autoprefixer(pack.prefix))
      .pipe(sourcemaps.write(pack.maps))
      .pipe(gulp.dest(pack.dest));
    streams.add(stream);
  });

  return streams;
});
gulp.task('build:js', 'Build JS files', function () {
  var streams = mergeStream();
  config.js.forEach(function (pack) {
    var stream = gulp
      .src(pack.src)
      .pipe(sourcemaps.init());

    if (pack.concat !== false) {
      stream = stream.pipe(concat(pack.concat));
    }
    if (pack.min) {
      stream = stream.pipe(minify({
        ext: {
          src: '.js',
          min: '.min.js'
        }
      }));
    }
    stream = stream
      .pipe(sourcemaps.write(pack.maps))
      .pipe(gulp.dest(pack.dest));

    streams.add(stream);
  });
  return streams;
});
