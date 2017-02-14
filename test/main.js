const assert = require('stream-assert');
const should = require('should');

const fs = require('fs');
const path = require('path');
const File = require('vinyl');
const stream = require('stream');

const gulp = require('gulp');
const gulpPuglint = require('../');

describe('gulp-puglint', () => {
  describe('minimalist configuration', function() {
    describe('in buffer mode', () => {
      it('should check files with no outputs', (done) => {
        gulp
        .src('./pug/**/*.pug')
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
      });
    });

    describe('in stream mode', () => {
      const configPath = path.resolve(__dirname, '.pug-lintrc');
      it('should check files with no outputs', (done) => {
        gulp
          .src(configPath)
          .pipe(gulp.dest('.'))
          .pipe(gulpPuglint())
          .pipe(assert.end(done));
        // // TODO
        // done();
      });
    });
  });



  describe('configuration from file path', () => {
    const configFilePath = 'no-exist-file';

    before((done) => {
      fs
        .createReadStream(configFilePath)
        .once('error', (error) => {
          should.exist(error);
          error.should.have.property('code');
          error.code.should.eql('ENOENT');
          done();
        })
        .pipe(assert.length(0))
        .pipe(assert.end(done));
    });

    it('should do nothing, when stream file is null', (done) => {
      gulp
        .src('')
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
    });

    it('should emit error, when config file not exist', (done) => {
      gulp
        .src('test/pug/**/*.pug')
        .pipe(gulpPuglint(configFilePath))
        .once('error', (error) => {
          should.exist(error);
          error.message.should.startWith('Config file not exists');
          done();
        })
        .pipe(assert.end(done));
    });
  });
});
