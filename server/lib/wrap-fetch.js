'use strict';

const wrappers = {
	instrument: require('@quarterto/instrument-fetch'),
};

const defaults = require('lodash.defaults');

const id = _ => _;

module.exports = (fetch, options) => {
	options = defaults(options, {
		instrument: process.env.NODE_ENV === 'instrument',
		getLabel: url => url.filter ? url.filter[1] : url,
	});

	return Object.keys(wrappers)
		.reduce(
			(wrapped, wrapperKey) => (options[wrapperKey] ? wrappers[wrapperKey] : id)(wrapped, options),
			fetch
		);
};
