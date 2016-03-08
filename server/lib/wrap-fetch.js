'use strict';

const wrappers = {
	instrument: require('@quarterto/instrument-fetch'),
	cache: require('@quarterto/fetch-cache'),
};

const defaults = require('lodash.defaults');

const id = _ => _;

module.exports = (fetch, options) => {
	defaults(options, {
		instrument: process.env.NODE_ENV === 'instrument',
		cache: false,
		getLabel: url => url.filter ? url.filter[1] : url,
		minTTL: 7200,
	});

	return Object.keys(wrappers)
		.reduce(
			(wrapped, wrapperKey) => (options[wrapperKey] ? wrappers[wrapperKey] : id)(wrapped, options),
			fetch
		);
};

