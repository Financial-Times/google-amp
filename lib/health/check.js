'use strict';

const severity = {
	HIGH: 1,
	MEDIUM: 2,
	LOW: 3
};

module.exports = (meta, check) => () => Promise.resolve().then(check).then(result => Object.assign({
	lastUpdated: new Date().toISOString(),
	severity: severity.HIGH
}, meta, result));

module.exports.severity = severity;
