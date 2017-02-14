const fs = require('fs');

const puglintConfig = require('pug-lint/lib/config-file');

const PluginError = require('./error');

/**
 *
 */
class Utils {

  /**
   * constructor - description
   *
   * @param  {type} pluginStream description
   */
  constructor(pluginStream) {
    this.plugin = {
      stream: pluginStream,
    };
  }

  /**
   * migrateOptions - description
   *
   * @param  {type} options description
   * @return {type}         description
   */
  migrateOptions(options) {
    let config = puglintConfig.load();

    if (typeof options === 'string') {
      if (!fs.existsSync(options)) {
        this.plugin.stream.emit('error',
          PluginError.create('Config file not exists: ' + options)
        );
      }
      config = puglintConfig.loadFromFile(options);
    } else if (typeof options === 'function') {
      config = Object.assign(config, options());
    } else {
      config = Object.assign(config, options);
    }
    return config;
  }
}

module.exports = Utils;
