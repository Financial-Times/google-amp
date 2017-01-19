'use strict';

const cheerioTransform = require('../cheeerio-transform');
const {parallel} = require('@quarterto/promise-deps-parallel');

const externalImages = require('../transforms/external-images');
const blockquotes = require('../transforms/blockquotes');

module.exports = cheerioTransform(parallel({
	externalImages,
	blockquotes,
}));
