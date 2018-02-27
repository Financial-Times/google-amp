'use strict';

const simpleTransform = require('./simple-transform');

module.exports = simpleTransform(
	'.n-content-related-box__title-text',
	el => {
		el.nodeName = 'div';
		el.attributes.class = 'c-box__title-text u-background-color--pink';
	}
);
