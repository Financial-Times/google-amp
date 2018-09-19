'use strict';

const addStoryPackage = require('../related-content/story-package');
const addMoreOns = require('../related-content/more-ons');
const contentFlags = require('../content/flags');
const transformArticle = require('../transforms/article');
const fetchSlideshows = require('../article/fetch-slideshows');
const transformSlideshows = require('../transforms/slideshows');
const isLiveBlog = require('../live-blogs/is-live-blog');
const getLiveBlog = require('../live-blogs/get-live-blog');
const handlebars = require('../handlebars');
const extraData = require('../content/extra-data');

const assembleArticle = async (article, options) => {
	await contentFlags(article, options);

	if(article.enableLiveBlogs && isLiveBlog(article.webUrl)) {
		article = await getLiveBlog(article, options);
	}

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
		extraData(article, options),
	]);

	return article;
};

module.exports = assembleArticle;

// TODO move somewhere shared
module.exports.render = (uuid, options) => assembleArticle(uuid, options)
	.then(article => handlebars.standalone().then(
		hbs => hbs.renderView('article', Object.assign({layout: 'layout'}, article))
	));
