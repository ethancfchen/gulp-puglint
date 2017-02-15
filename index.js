const through = require('through2');
const gutil = require('gulp-util');
const BufferStreams = require('bufferstreams');
const path = require('path');

const PugLint = require('pug-lint');
const Utils = require('./src/utils');

/**
 * gulpPuglint - description
 *
 * @param  {type} options description
 * @return {type}         description
 */
function gulpPuglint(options) {
  const puglint = new PugLint();

  /**
   * verify - description
   *
   * @param  {type} string   description
   * @param  {type} filePath description
   * @return {type}          description
   */
  function verify(string, filePath) {
    return puglint.checkString(string, filePath);
  }

  const stream = through.obj((file, encoding, callback) => {
    const filePath = path.relative(process.cwd(), file.path);
    let config = {};

    try {
      config = Utils.migrateOptions(options);
    } catch (error) {
      stream.emit('error', Utils.createError(error.message));
      return;
    }

    puglint.configure(config);

    // let linterOutputs = null;

    if (file.isNull()) {
      callback(null, file);
      return;
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(
        new BufferStreams((error, buffer, done) => {
          file.puglint = verify(String(buffer), filePath);
          done(null, buffer);
          callback(null, file);
        })
      );
      return;
    }

    file.puglint = verify(file.contents.toString(), filePath);

    // if (file.puglint.length) {
    //   linterOutputs = file.puglint.map((error) => {
    //     return error.message;
    //   }).join('\n\n');
    //   gutil.log(linterOutputs);
    // }

    callback(null, file);
  });

  return stream;
}

gulpPuglint.result = (action) => {
  if (typeof action !== 'function') {
    throw new Error('Expected callable argument');
  }

  const stream = through.obj((file, encoding, callback) => {
    const linterOutputs = file.puglint;
    if (linterOutputs) {
      const transformCallback = Utils.handleCallback(callback, file);
      Utils.tryResultAction(action, linterOutputs, transformCallback);
    } else {
      callback(null, file);
    }
  });

  return stream;
};

gulpPuglint.results = (action) => {
  if (typeof action !== 'function') {
    throw new Error('Expected callable argument');
  }

  const results = [];
  // results.errorCount = 0;
  // results.warningCount = 0;

  const stream = through.obj((file, encoding, callback) => {
    const linterOutputs = file.puglint;
    if (linterOutputs) {
      linterOutputs.forEach((linterOutput) => {
        results.push(linterOutput);
      });
      // results.push(linterOutputs);
      // results.errorCount += linterOutputs.errorCount;
      // results.warningCount += linterOutputs.warningCount;
    }
    callback(null, file);
  }, (callback) => {
    const flushCallback = Utils.handleCallback(callback);
    Utils.tryResultAction(action, results, flushCallback);
  });

  return stream;
};

gulpPuglint.failOnError = () => {
  return gulpPuglint.result((result) => {
    const error = Utils.firstResultMessage(result, Utils.isErrorMessage);
    if (!error) {
      return;
    }

    throw Utils.createError({
      name: 'PugLintError',
      fileName: result.filePath,
      message: error.message,
      lineNumber: error.line,
    });
  });
};

gulpPuglint.failAfterError = () => {
  // TODO
};

gulpPuglint.formatEach = (formatter, writable) => {
  // TODO
};

gulpPuglint.format = (formatter, writable) => {
  formatter = Utils.resolveFormatter(formatter);
  writable = Utils.resolveWritable(writable);

  return gulpPuglint.results((results) => {
    if (results.length) {
      Utils.writeResults(results, formatter, writable);
    }
  });
};

module.exports = gulpPuglint;
