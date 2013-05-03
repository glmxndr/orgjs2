var _ = require('lodash');

var Config = {};

Config.defaults = {
  tabSize: 4,
  headingTodos: ['TODO', 'DONE'],
  headingPriorities: ['A', 'B', 'C']
};

/**
 * Prepare a given configuration object into a full-blown 
 * configuration, with all omitted defaults values in place.
 * 
 * @param  {Object} params the partial configuration object
 * @return {Object}        the complete configuration, with defaults
 */
Config.prepare = function (params) {
  var result = _.defaults({}, params, Config.defaults);
  result.get = result.get || function (prop, def) {
    return this.hasOwnProperty(prop) ? this[prop] : def;
  };
  return result;
};

module.exports = exports = Config;