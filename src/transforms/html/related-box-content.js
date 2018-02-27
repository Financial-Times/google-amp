'use strict';

const simpleTransform = require('./simple-transform');

module.exports = simpleTransform(
	'.n-content-related-box__content',
	el => {
		el.attributes.class = 'aside--content u-margin--left-right';
	}
);
