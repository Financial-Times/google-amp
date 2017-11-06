'use strict';

const fetchres = require('fetchres');
const defaults = require('lodash.defaults');

module.exports = function reportError(raven, error, options) {
	options = defaults(options, {
		getErrorLevel(err) {
			if (fetchres.originatedError(err) || err.isWarning) {
				return 'warning';
			}

			return 'error';
		}
	});

	if (raven) {
		raven.captureException(error, Object.assign({
			level: options.getErrorLevel(error)
		}, options));
	} else {
		console.error(error.stack || error.message || error.toString(), options);
	}
};
