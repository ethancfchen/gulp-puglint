const gutil = require('gulp-util');

const fs = require('fs');
const path = require('path');

const puglintConfig = require('pug-lint/lib/config-file');

const PLUGIN_NAME = 'gulp-puglint';

module.exports = {
  /**
   * createError - description
   *
   * @param  {type} content description
   * @return {type}         description
   */
  createError(content) {
    const pluginName = (content || {}).plugin || PLUGIN_NAME;
    const showStack = (content || {}).showStack !== false;
    return new gutil.PluginError(pluginName, content, {
      showStack,
    });
  },

  /**
   * migrateOptions - description
   *
   * @param  {type} options description
   * @return {type}         description
   */
  migrateOptions(options) {
    let config = puglintConfig.load() || {};

    if (typeof options === 'string') {
      const configFilePath = path.resolve(process.cwd(), options);
      if (!fs.existsSync(configFilePath)) {
        throw new Error('Config file not exists: ' + configFilePath);
      }
      config = puglintConfig.loadFromFile(configFilePath);
    } else if (typeof options === 'function') {
      config = Object.assign(config, options());
    } else {
      config = Object.assign(config, options || {});
    }
    return config;
  },

  /**
   * handleCallback - description
   *
   * @param  {type} callback description
   * @param  {type} file     description
   * @return {type}          description
   */
  handleCallback(callback, file) {
    return (error) => {
      if (error !== undefined &&
          error !== null &&
          !(error instanceof gutil.PluginError)) {
        error = this.createError(error);
      }
      callback(error, file);
    };
  },

  /**
   * tryResultAction - description
   *
   * @param  {type} action   description
   * @param  {type} result   description
   * @param  {type} callback description
   */
  tryResultAction(action, result, callback) {
    try {
      if (action.length > 1) {
        action.call(this, result, callback);
      } else {
        action.call(this, result);
        callback();
      }
    } catch (error) {
      callback(error === null ? new Error('Unknown Error') : error);
    }
  },

  /**
   * firstResultMessage - description
   *
   * @param  {type} result    description
   * @param  {type} condition description
   * @return {type}           description
   */
  firstResultMessage(result, condition) {
    if (!result.messages) {
      return null;
    }
    return result.messages.find(condition);
  },

  /**
   * isErrorMessage - description
   *
   * @param  {type} message description
   * @return {type}         description
   */
  isErrorMessage(message) {
    if (!message || typeof message !== 'object') {
      return false;
    }
    return message.constructor === Error;
  },
};
