'use strict';
const cheerio = require('cheerio');
const captionHeight = 50;
const handlebars = require('handlebars');
const cacheIf = require('@quarterto/cache-if');
const fs = require('fs-promise');
const path = require('path');
const viewsPath = path.resolve('views');

const readTemplate = () => fs.readFile(`${viewsPath}/slideshow.html`, 'utf8').then(handlebars.compile);
const getTemplate = precompiled => cacheIf(() => precompiled, readTemplate);

const average = (items, dimension) =>
	items.reduce((previous, current) => previous + current[dimension], 0) / items.length;

module.exports = function run(article, options) {
	const $ = cheerio.load(article.htmlBody, {decodeEntities: false});

	return getTemplate(options.production)
	.then(template => {
		$('ft-slideshow').map((i, el) => {
			const uuid = el.attribs['data-uuid'];
			const slideshow = article.slideshows[uuid];

			if(!slideshow) return $(el).remove();

			const slides = slideshow.slides.map((slide, index) => Object.assign(slide, {index}));
			const hasCaption = slides.some(slide => slide.caption);
			const width = average(slides, 'width');
			const height = average(slides, 'height');

			const templated = template({
				title: slideshow.title,
				uuid,
				slides,
				width,
				height: height + (hasCaption ? captionHeight : 0),
			});

			return $(el).replaceWith($(templated));
		});

		article.htmlBody = $.html();
	});
};
