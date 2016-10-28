'use strict';
const handlebars = require('handlebars');
const fs = require('fs-promise');
const path = require('path');
const promisify = require('@quarterto/promisify');
const glob = promisify(require('glob'));
const promiseAllObj = require('@quarterto/promise-all-object');
const url = require('./url');
const getCss = require('./get-css');
const cacheIf = require('@quarterto/cache-if');

const viewsPath = path.resolve('views');
const partialsPath = path.resolve('views/partials');

const readTemplate = template => fs.readFile(`${viewsPath}/${template}.html`, 'utf8').then(handlebars.compile);
const getBody = precompiled => cacheIf(() => precompiled, () => readTemplate('body'));
const getLayout = precompiled => cacheIf(() => precompiled, () => readTemplate('layout'));

// TODO: use n-handlebars and get this for free?
const applyPartials = () => glob(`${partialsPath}/**/*.html`)
	.then(files => {
		const promises = files.map(file => {
			const name = file.replace(/^.*\/(.*)\.html$/, '$1');
			return fs.readFile(file, 'utf8')
				.then(html => handlebars.registerPartial(name, html));
		});
		return Promise.all(promises);
	});
const getPartials = precompiled => cacheIf(() => precompiled, applyPartials);

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

module.exports = (data, options) => promiseAllObj({
	body: getBody(options.production),
	layout: getLayout(options.production),
	partials: getPartials(options.production),
	description: data.summaries ? data.summaries[0] : '',
	authorList: getAuthors(data),
	byline: getByline(data, options),
	mainImage: getMainImage(data),
}).then(t => {
	const body = t.body(Object.assign(data, t));
	return getCss(options.production, body).then(css =>
		t.layout(Object.assign(data, {css, body}))
	);
});
