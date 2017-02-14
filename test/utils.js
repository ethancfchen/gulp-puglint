const should = require('should');

const path = require('path');
const Utils = require('../src/utils');

describe('src/utils', () => {
  describe('migrateOptions()', () => {
    const configFilePath = path.resolve(process.cwd(), 'file-not-exist');

    it('shoud throw, when file not found', (done) => {
      (() => {
        Utils.migrateOptions('file-not-exist');
      }).should.throw('Config file not exists: ' + configFilePath);
      done();
    });

    it('should read from file', (done) => {
      const config = Utils.migrateOptions('test/.pug-lintrc');
      should.exist(config);
      config.should.instanceof(Object);
      done();
    });
  });
});
