'use strict';

const simpleTransform = require('./simple-transform');

module.exports = simpleTransform(
	'.subhead',
	el => {
		el.attributes.class = 'article__subhead article__subhead--standard';
	}
);
