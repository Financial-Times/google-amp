'use strict';

const getArticle = require('../article/get-article');
const addStoryPackage = require('../related-content/story-package');
const addMoreOns = require('../related-content/more-ons');
const addPrimaryTheme = require('../transforms/extra/primary-theme');
const articleFlags = require('../article/article-flags');
const transformArticle = require('../transforms/article');
const fetchSlideshows = require('../article/fetch-slideshows');
const transformSlideshows = require('../transforms/slideshows');
const isLiveBlog = require('../live-blogs/is-live-blog');
const getLiveBlog = require('../live-blogs/get-live-blog');

const errors = require('http-errors');
const fetchres = require('fetchres');
const fs = require('fs-promise');

const promiseAllObj = require('@quarterto/promise-all-object');
const url = require('../url');
const getCSS = require('./css');
const environmentOptions = require('./environment-options');

const getAuthors = data => {
	const authors = data.metadata
		.filter(item => !!(item.taxonomy && item.taxonomy === 'authors'))
		.map(item => item.prefLabel);

	// Somtimes there are no authors in the taxonomy. It's very sad but it's true.
	return authors.length ? authors.join(', ') : (data.byline || '').replace(/^by\s+/i, '');
};

const getByline = (data, options) => {
	const promises = data.metadata
		.filter(item => !!(item.taxonomy && item.taxonomy === 'authors'))
		.map(author => url.stream(author, options)
			.then(streamUrl => {
				author.streamUrl = streamUrl;
				return author;
			})
		);

	return Promise.all(promises)
		.then(authors => {
			let byline = (data.byline || '').replace(/^by\s+/i, '');

			authors.filter(author => !!author.streamUrl)
				.forEach(author => {
					byline = byline.replace(author.prefLabel,
						'<a class="article-author-byline__author"' +
						` href="${author.streamUrl}" data-vars-link-destination="${author.streamUrl}" ` +
						`data-vars-link-type="author-byline" data-vars-link-text="${author.prefLabel}">${author.prefLabel}</a>`
					);
				});
			return byline;
		});
};

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

const assembleArticle = (uuid, options) => {
	Object.assign(options, environmentOptions);
	return getArticle(uuid)
		.then(
			response => {
				if(response._source &&
					(!response._source.originatingParty || response._source.originatingParty === 'FT')
				) {
					return response._source;
				}

				return Promise.reject(new errors.NotFound());
			},
			err => (
				console.log(err),
				Promise.reject(err.name === fetchres.BadServerResponseError.name ? new errors.NotFound() : err)
			)
		)
		.then(article => articleFlags(article, options))
		.then(article => {
			if(article.enableLiveBlogs && isLiveBlog(article.webUrl)) {
				return getLiveBlog(article, options);
			}

			return article;
		})

		// First phase: network-dependent fetches and transforms in parallel
		.then(article => Promise.all(
			[
				transformArticle(article, options),
				addStoryPackage(article, options),
				addMoreOns(article, options),
				addPrimaryTheme(article, options),
				fetchSlideshows(article, options),
			])

			// Second phase: transforms which rely on first phase fetches
			.then(() => Promise.all([
				transformSlideshows(article, options),
				extraArticleData(article, options),
			])

			// Return the article
			.then(() => article))
		);
};

module.exports = assembleArticle;

if(module === require.main) {
	assembleArticle(process.argv[2], {
		production: false,
		showEverything: true,
		relatedArticleDeduper: [process.argv[2]],
	}).then(
		rendered => fs.writeFile(process.argv[3], rendered),
		err => {
			console.error(err.stack || err.toString());
			process.exit(1);
		}
	);
}
