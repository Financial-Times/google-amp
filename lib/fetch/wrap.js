'use strict';

const pkg = require('../../package.json');

const wrappers = {
	userAgent: require('./user-agent')
};

const defaults = require('lodash.defaults');

const id = _ => _;

module.exports = (fetch, options = {}) => {
	options = defaults(options, {
		userAgent: `ft-google-amp v${pkg.version}`
	});

	return Object.keys(wrappers).reduce((wrapped, wrapperKey) => (options[wrapperKey] ? wrappers[wrapperKey] : id)(wrapped, options), fetch);
};
