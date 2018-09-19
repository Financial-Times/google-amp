'use strict';

const getCSS = require('./css');

const getAuthors = content => (content.byline || '').replace(/^by\s+/i, '');

const getByline = content => (content.authorConcepts || []).reduce(
	(byline, author) => byline.replace(author.prefLabel, `
		<a
			class="content-author-byline__author"
			href="${author.url}"
			data-vars-link-destination="${author.url}"
			data-vars-link-type="author-byline"
			data-vars-link-text="${author.prefLabel}">
			${author.prefLabel}
		</a>
	`),
	(content.byline || '').replace(/^by\s+/i, '')
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

module.exports = async (content, options) => Object.assign(content, {
	authorList: getAuthors(content),
	byline: getByline(content, options),
	mainImage: getMainImage(content),
	css: await getCSS(content, options),
});
