const assert = require('stream-assert');
const should = require('should');

const fs = require('fs');

const gulp = require('gulp');
const gulpPuglint = require('../');

describe('gulp-puglint', () => {
  describe('minimalist configuration', () => {
    it('should check files', (done) => {
      gulp
        .src('./pug/**/*.pug')
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
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
