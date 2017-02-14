const path = require('path');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const args = require('yargs').option({
  v: {
    alias: 'version',
    type: 'string',
    nargs: 1,
  },
}).argv;

gulp.task('static', () => {
  return gulp.src(['**/*.js'])
    .pipe($.excludeGitignore())
    .pipe($.eslint('.eslintrc.js'))
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

gulp.task('pre-test', () => {
  return gulp.src(['index.js', 'src/**/*.js'])
    .pipe($.excludeGitignore())
    .pipe($.istanbul({
      includeUntested: true,
    }))
    .pipe($.istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], (cb) => {
  let mochaErr = null;

  gulp.src('test/**/*.js')
    .pipe($.plumber())
    .pipe($.mocha({reporter: 'spec'}))
    .on('error', (err) => {
      mochaErr = err;
    })
    .pipe($.istanbul.writeReports())
    .on('end', () => {
      cb(mochaErr);
    });
});

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls());
});

gulp.task('bump', () => {
  gulp.src('./package.json')
    .pipe($.bump({
      type: args.version,
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['static', 'test', 'coveralls']);


gulp.task('use', () => {
  const gulpPuglint = require('./');
  gulp
    .src('test/pug/**/*.pug')
    .pipe(gulpPuglint());
});
