'use strict';

const transformBody = require('../transform-body');

module.exports = transformBody(
	require('../xml-transforms/external-images')
);
