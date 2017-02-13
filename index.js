const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

const PugLint = require('pug-lint');
const puglintConfig = require('pug-lint/lib/config-file');

const Utils = require('./src/utils');

const PLUGIN_NAME = 'gulp-puglint';


/**
 * gulpPuglint - description
 *
 * @param  {type} options description
 * @return {type}         description
 */
function gulpPuglint(options) {
  const config = puglintConfig.load();
  const puglint = new PugLint();

  puglint.configure(config);

  return Utils.transform((file, encoding, callback) => {
    let errors = null;
    let outputs = null;

    if (file.isNull()) {
      return callback(null, file);
    }

    // if (file.isBuffer()) {
    //   // TODO
    //   return callback(
    //     new PluginError(PLUGIN_NAME, 'Buffer is not supported')
    //   );
    // }

    if (file.isStream()) {
      // TODO
      return callback(
        new PluginError(PLUGIN_NAME, 'Streaming is not supported')
      );
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
