'use strict';

const nEsClient = require('@financial-times/n-es-client');
const promiseAllObj = require('@quarterto/promise-all-object');
const addStoryPackage = require('../related-content/story-package');
const addMoreOns = require('../related-content/more-ons');
const articleFlags = require('../article/article-flags');
const transformArticle = require('../transforms/article');
const fetchSlideshows = require('../article/fetch-slideshows');
const transformSlideshows = require('../transforms/slideshows');

const getCSS = require('./css');
const environmentOptions = require('./environment-options');
const handlebars = require('../handlebars');

const getAuthors = article => (article.byline || '').replace(/^by\s+/i, '');

const getByline = article => (article.authorConcepts || []).reduce(
	(byline, author) => byline.replace(author.prefLabel, `
		<a
			class="article-author-byline__author"
			href="${author.url}"
			data-vars-link-destination="${author.url}"
			data-vars-link-type="author-byline"
			data-vars-link-text="${author.prefLabel}">
			${author.prefLabel}
		</a>
	`),
	(article.byline || '').replace(/^by\s+/i, '')
);

const getMainImage = data => {
	if(data.mainImage) {
		return {
			url: data.mainImage.url,
			width: data.mainImage.width,
			height: data.mainImage.height,
		};
	} else {
		// Return a default logo image if an actual image is not available
		// TODO pull out the lead image from the body XML if possible
		return {
			url: 'http://im.ft-static.com/m/img/social/og-ft-logo-large.png',
			// https://developers.google.com/search/docs/data-types/articles - minimum width = 696px
			width: 696,
			height: 696,
		};
	}
};

const extraArticleData = (article, options) => promiseAllObj({
	authorList: getAuthors(article),
	byline: getByline(article, options),
	mainImage: getMainImage(article),
	css: getCSS(article, options),
}).then(extra => Object.assign(article, extra));

const assembleArticle = async (article, options) => {
	options = Object.assign({}, environmentOptions, options);

	// append additional article data derived from options
	articleFlags(article, options);

	// First phase: network-dependent fetches and transforms in parallel
	await Promise.all([
		transformArticle(article, options),
		addStoryPackage(article, options),
		addMoreOns(article, options),
		fetchSlideshows(article, options),
	]);

	// Second phase: transforms which rely on first phase fetches
	await Promise.all([
		transformSlideshows(article, options),
		extraArticleData(article, options),
	]);

	return article;
};

module.exports = assembleArticle;
module.exports.render = async (uuid, options) => {
	const article = await nEsClient.get(uuid);
	const transformed = await assembleArticle(article, options);
	const hbs = await handlebars.standalone();
	return hbs.renderView('article', Object.assign({layout: 'layout'}, transformed));
};
