const _ = require("lodash");
let config = _.cloneDeep(require("./config_default"))

try {
  const envConfig = require('./config') // eslint-disable-line
  config = _.merge(config, envConfig);
} catch (e) {}
module.exports = config;
