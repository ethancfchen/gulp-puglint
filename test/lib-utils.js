const should = require('should');

const path = require('path');
const gutil = require('gulp-util');
const Utils = require('../lib/utils');

describe('lib/utils', () => {
  describe('createError()', () => {
    it('should throw, when input is empty.', (done) => {
      (() => {
        return Utils.createError();
      }).should.throw('Missing error message');
      done();
    });

    it('should return PluginError, when input is a plain message.', (done) => {
      const defaultPluginName = 'gulp-puglint';
      const mockMessage = 'mock error message';

      const error = Utils.createError(mockMessage);

      error.should.instanceof(gutil.PluginError);
      error.should.have.value('plugin', defaultPluginName);
      error.should.have.value('message', mockMessage);
      error.should.have.value('showStack', true);
      done();
    });

    it('should return PluginError, when input is a PluginError.', (done) => {
      const mockPluginName = 'mock-plugin';
      const mockErrorMessage = 'mock error message';
      const mockPluginError = new gutil.PluginError(
        mockPluginName,
        mockErrorMessage, {
          showStack: false,
        });

      const error = Utils.createError(mockPluginError);

      error.should.instanceof(gutil.PluginError);
      error.should.have.value('plugin', mockPluginName);
      error.should.have.value('message', mockErrorMessage);
      error.should.have.value('showStack', false);
      done();
    });
  });

  describe('migrateOptions()', () => {
    const configFilePath = path.resolve(process.cwd(), 'file-not-exist');

    it('shoud throw, when file not found.', (done) => {
      (() => {
        return Utils.migrateOptions('file-not-exist');
      }).should.throw('Config file not exists: ' + configFilePath);
      done();
    });

    it('should read from file.', (done) => {
      const config = Utils.migrateOptions('test/.pug-lintrc');

      should.exist(config);
      config.should.instanceof(Object);
      done();
    });

    it('should input from a function.', (done) => {
      const mockOptionValue = 'mockOptionValue';

      const config = Utils.migrateOptions(() => {
        return {
          mockOption: mockOptionValue,
        };
      });

      should.exist(config);
      config.should.instanceof(Object);
      config.should.have.ownProperty('mockOption');
      config.should.have.value('mockOption', mockOptionValue);
      done();
    });
  });

  describe('handleCallback()', () => {
    const mockError = new Error('mock error');
    const mockFileBuffer = new Buffer('mock file');

    it('should return callback function for through2 without error', (done) => {
      const callback = Utils.handleCallback((error, file) => {
        should.not.exist(error);
        should.exist(file);
        file.should.instanceof(Buffer);
        file.toString('utf-8').should.be.exactly('mock file');
        return 'no return';
      }, mockFileBuffer);

      callback.should.be.Function();
      should.not.exist(callback());
      should.not.exist(callback(null));
      done();
    });

    it('should return callback function for through2 with error', (done) => {
      const callback = Utils.handleCallback((error, file) => {
        should.exist(error);
        error.should.instanceof(Error);
        error.should.have.value('message', 'mock error');
        should.exist(file);
        file.should.instanceof(Buffer);
        file.toString('utf-8').should.be.exactly('mock file');
        return 'no return';
      }, mockFileBuffer);

      callback.should.be.Function();
      should.not.exist(callback(mockError));
      done();
    });
  });

  describe('tryResultAction()', () => {
    const mockResult = {mockKey: 'mock value'};

    it('should run as synchronous action.', (done) => {
      let streamCallbackResult = 'passed';

      should.doesNotThrow(() => {
        streamCallbackResult = Utils.tryResultAction((result) => {
          should.exist(result);
          result.should.be.exactly(mockResult);
        }, mockResult, () => {
          return 'no return';
        });
      });
      should.not.exist(streamCallbackResult);
      done();
    });

    it('should run as asynchronous action.', (done) => {
      let streamCallbackResult = 'passed';
      const mockError = new Error('mock error');

      should.doesNotThrow(() => {
        streamCallbackResult = Utils.tryResultAction((result, callback) => {
          should.exist(result);
          result.should.be.exactly(mockResult);
          callback(mockError);
        }, mockResult, (error) => {
          should.exist(error);
          error.should.be.exactly(mockError);
          return 'no return';
        });
      });
      should.not.exist(streamCallbackResult);
      done();
    });

    it('should run action with error occured.', (done) => {
      const mockError = new Error('mock error');
      let streamCallbackResult = 'passed';

      should.doesNotThrow(() => {
        streamCallbackResult = Utils.tryResultAction((result) => {
          throw mockError;
        }, mockResult, (error) => {
          should.exist(error);
          error.should.be.exactly(mockError);
          return 'passed';
        });
      });
      should.not.exist(streamCallbackResult);
      done();
    });
  });

  describe('firstResultMessage()', () => {
    const mockMessages = [{
      id: 1,
      message: 'mock message 1',
    }, {
      id: 2,
      message: 'mock message 2',
    }, {
      id: 3,
      message: 'mock message 3',
    }];

    it('should return message on given condition.', (done) => {
      const result = Utils.firstResultMessage(mockMessages, (message) => {
        return message.id <= 2;
      });

      should.exist(result);
      result.should.have.properties({
        id: 1,
        message: 'mock message 1',
      });
      done();
    });

    it('should return null if messages is empty.', (done) => {
      const result = Utils.firstResultMessage(null, (message) => {
        return message.id <= 2;
      });

      should(result).be.null();
      done();
    });
  });

  describe('isErrorMessage()', () => {
    it('should return true, when given an error object', (done) => {
      const mockMessage = new Error('mock error');

      const result = Utils.isErrorMessage(mockMessage);
      result.should.be.true();
      done();
    });

    it('should return false, when message not instance of Error', (done) => {
      Utils.isErrorMessage().should.be.false();
      Utils.isErrorMessage(null).should.be.false();
      Utils.isErrorMessage({}).should.be.false();
      Utils.isErrorMessage('').should.be.false();
      Utils.isErrorMessage(' ').should.be.false();
      Utils.isErrorMessage('mock string').should.be.false();
      Utils.isErrorMessage({msg: 'mock object'}).should.be.false();
      Utils.isErrorMessage([]).should.be.false();
      Utils.isErrorMessage(['']).should.be.false();
      done();
    });
  });
});
