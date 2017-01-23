'use strict';

const pkg = require('../../../package.json');

const wrappers = {
	instrument: require('@quarterto/instrument-fetch'),
	userAgent: require('./user-agent'),
};

const defaults = require('lodash.defaults');

const id = _ => _;

module.exports = (fetch, options) => {
	options = defaults(options, {
		instrument: process.env.NODE_ENV === 'instrument',
		userAgent: `ft-google-amp v${pkg.version}`,
		getLabel: url => url.filter ? url.filter[1] : url,
	});

	return Object.keys(wrappers)
		.reduce(
			(wrapped, wrapperKey) => (options[wrapperKey] ? wrappers[wrapperKey] : id)(wrapped, options),
			fetch
		);
};
