const assert = require('stream-assert');
const should = require('should');

const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const gulpPuglint = require('../');

const testFiles = 'test/pug/**/*.pug';

describe('gulp-puglint', () => {
  describe('minimalist configuration (no rules)', () => {
    it('should do nothing, when stream file is null', (done) => {
      gulp
        .src('')
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
    });

    it('should check files with no outputs in buffer mode', (done) => {
      gulp
        .src(testFiles)
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
    });

    it('should check files with no outputs in stream mode', (done) => {
      gulp
        .src(testFiles, {buffer: false})
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
    });
  });

  describe('configuration from inexist file path', () => {
    const fakeFailedFile = 'no-exist-file';

    before((done) => {
      fs
        .createReadStream(fakeFailedFile)
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
        .src(testFiles)
        .pipe(gulpPuglint(fakeFailedFile))
        .once('error', (error) => {
          should.exist(error);
          error.message.should.startWith('Config file not exists');
          done();
        })
        .pipe(assert.end(done));
    });
  });

  describe('configuration from project level file', () => {
    const projectConfig = path.join(__dirname, '../.pug-lintrc');

    before((done) => {
      fs
        .createReadStream(path.join(__dirname, '.pug-lintrc'))
        .pipe(assert.length(1))
        .once('data', (data) => {
          fs.writeFile(projectConfig, data, done);
        });
    });

    it('should output in original format', (done) => {
      gulp
        .src(testFiles)
        .pipe(gulpPuglint())
        .pipe(assert.end(done));
    });

    after((done) => {
      fs.unlink(projectConfig, done);
    });
  });

  describe('configuration from specified file', () => {
    it('should output in original format', (done) => {
      gulp
        .src(testFiles)
        .pipe(gulpPuglint('test/.pug-lintrc'))
        .pipe(assert.end(done));
    });
  });
});
