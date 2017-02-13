const assert = require('stream-assert');

const gulp = require('gulp');
const gulpPuglint = require('../');

describe('gulp-puglint', () => {
  describe('minimalist configuration', () => {
    it('should check files normally', (done) => {
      gulp
        .src('./pug/**/*.pug')
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
    });
  });
});
