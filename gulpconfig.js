/* eslint-env node */
'use strict';

var options = {
  bowerJsonDirectory: './themes/custom/scaffold/',
  // Packages of SCSS that will be compiled.
  scss: [
    {
      src: './themes/custom/scaffold/scss/*.scss',
      maps: '../maps',
      prefix: {browsers: 'last 2 versions', cascade: false},
      dest: './themes/custom/scaffold/dist/css'
    }
  ],
  // Packages of javascript that will be compiled.
  js: [
    {
      src: ['./themes/custom/scaffold/js/*.js'],
      concat: false,
      min: true,
      maps: '../maps',
      dest: './themes/custom/scaffold/dist/js'
    },
    {
      src: './themes/custom/scaffold/bower_components/foundation-sites/dist/foundation.js',
      concat: 'libs.js',
      min: true,
      maps: '../maps',
      dest: './themes/custom/scaffold/dist/js'
    }
  ],
  // Patterns for PHP files to lint and check.
  phpCheck: ['{modules,themes}/custom/**/*.{php,inc,module,theme,inc}'],
  // Patterns for JS files to lint and check.
  jsCheck: [
    'gulpfile.js',
    'gulpconfig.js',
    '{modules,themes}/custom/**/*.js',
    '!{modules,themes}/custom/**/bower_components/**',
    '!{modules,themes}/custom/**/dist/**'
  ]
};

module.exports = options;