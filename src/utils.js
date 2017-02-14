const fs = require('fs');
const path = require('path');

const puglintConfig = require('pug-lint/lib/config-file');

module.exports = {
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
};
