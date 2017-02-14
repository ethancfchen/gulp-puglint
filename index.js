const through = require('through2');
const gutil = require('gulp-util');

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

  const stream = through.obj((file, encoding, callback) => {
    const utils = new Utils(stream);
    const config = utils.migrateOptions(options);

    puglint.configure(config);

    let errors = null;
    let outputs = null;

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isBuffer()) {
      // const error = PluginError.create('Buffers not supported!');
      // stream.emit('error', error);
      // return callback(error);
    }

    if (file.isStream()) {
      // const error = PluginError.create('Streams not supported!');
      // stream.emit('error', error);
      // return callback(error);
    }

    errors = puglint.checkFile(file.path);

    if (errors.length) {
      outputs = errors.map((error) => {
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
