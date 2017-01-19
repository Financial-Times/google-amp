'use strict';

const transformBody = require('../transform-body');
const {parallel} = require('@quarterto/promise-deps-parallel');

const externalImages = require('../xml-transforms/external-images');
const blockquotes = require('../xml-transforms/blockquotes');

module.exports = transformBody(parallel({
	externalImages,
	blockquotes,
}));
