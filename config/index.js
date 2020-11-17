const _ = require("lodash");
let config = _.cloneDeep(require("./config_default"))

try {
  const envConfig = require('./config') // eslint-disable-line
  config = _.merge(config, envConfig);
} catch (e) {
  if (!config.debug) {
    console.log('[message] loading config/config.js failed:', e.message); // eslint-disable-line
  } else if (e.code !== "MODULE_NOT_FOUND") {
      console.log('[message] loading config/config.js failed:', e.message); // eslint-disable-line
  }
}
module.exports = config;
