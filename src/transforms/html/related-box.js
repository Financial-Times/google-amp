'use strict';

const simpleTransform = require('./simple-transform');

module.exports = simpleTransform(
	'.n-content-related-box',
	el => Object.assign(el.attributes, {
		class: 'c-box c-box--inline u-border--all',
		'data-trackable': 'related-box',
	})
);
