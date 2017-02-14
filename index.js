const through = require('through2');
const gutil = require('gulp-util');
const BufferStreams = require('bufferstreams');
const path = require('path');

const PugLint = require('pug-lint');
const Utils = require('./src/utils');
const PluginError = require('./src/error');

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
    } catch (e) {
      stream.emit('error', PluginError.create(e.message));
    }

    puglint.configure(config);

    let outputs = null;

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      file.contents = file.contents.pipe(
        new BufferStreams((error, buffer, done) => {
          file.puglint = verify(String(buffer), filePath);
          done(null, buffer);
        })
      );
      return callback(null, file);
    }

    file.puglint = verify(file.contents.toString(), filePath);

    if (file.puglint.length) {
      outputs = file.puglint.map((error) => {
        return error.message;
      }).join('\n\n');
      gutil.log(outputs);
    }

    callback(null, file);
  });

  return stream;
}

gulpPuglint.result = (action) => {
  // TODO
};

gulpPuglint.results = (action) => {
  // TODO
};

gulpPuglint.failOnError = () => {
  // TODO
};

gulpPuglint.failAfterError = () => {
  // TODO
};

gulpPuglint.formatEach = (formatter, writable) => {
  // TODO
};

gulpPuglint.format = (formatter, writable) => {
  // TODO
};

module.exports = gulpPuglint;
