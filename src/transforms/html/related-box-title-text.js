'use strict';

const simpleTransform = require('./simple-transform');

module.exports = simpleTransform(
	'.n-content-related-box__headline',
	el => {
		el.attributes.class = 'aside--headline u-margin--left-right';
	}
);
