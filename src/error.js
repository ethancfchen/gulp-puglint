const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-puglint';

module.exports = {

  /**
   * create - description
   *
   * @param  {type} text description
   * @return {type}      description
   */
  create(text) {
    return new PluginError(PLUGIN_NAME, text);
  },
};
