'use strict';

const getContentController = require('./get-content-controller');
const fetchContent = require('../lib/content/fetch');
const transformArticle = require('../lib/article/transform');

module.exports = getContentController({
	fetch: fetchContent({type: 'article'}),
	transform: transformArticle,
	template: 'article',
});
