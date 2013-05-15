var _ = require('./utils')._;

var Config = {};

Config.defaults = {
  include: true,
  basePath: './',
  tabSize: 4,
  headlineTodos: ['TODO', 'DONE'],
  headlinePriorities: ['A', 'B', 'C'],
  get: function (p, def) { return this.hasOwnProperty(p) ? this[p] : def; }
};

/**
 * Prepare a given configuration object into a full-blown 
 * configuration, with all omitted defaults values in place.
 * 
 * @param  {Object} params the partial configuration object
 * @return {Object}        the complete configuration, with defaults
 */
Config.prepare = function (params) {
  return _.defaults({}, params, Config.defaults);
};

module.exports = exports = Config;