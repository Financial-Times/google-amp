'use strict';
const cheerio = require('cheerio');
const captionHeight = 50;

module.exports = function run(article) {
	const $ = cheerio.load(article.htmlBody, {decodeEntities: false});

	$('ft-slideshow').map((index, el) => {
		const uuid = el.attribs['data-uuid'];
		const slideshow = article.slideshows[uuid];

		if(!slideshow) return $(el).remove();

		const images = slideshow.slides.map(slide => {
			return `<div class="slideshow__slide"><amp-img class="slideshow__image" src="https://h2.ft.com/image/v1/images/raw/${slide.url}?source=amp&amp;fit=scale-down&amp;width=700" alt="${slide.alt}" layout="responsive" width="${slide.width}" height="${slide.height}"></amp-img><div class="slideshow__caption">${slide.caption}</div></div>`;
		})
		.join('');

		const width = slideshow.slides.reduce((previous, current) => previous + current.width, 0) / slideshow.slides.length;
		const height = slideshow.slides.reduce((previous, current) => previous + current.height, 0) / slideshow.slides.length;

		return $(el).replaceWith($(`<div class="slideshow"><div class="slideshow__title-wrapper"><amp-fit-text class="slideshow__title" layout="fill">${slideshow.title}</amp-fit-text></div><amp-carousel type="slides" layout="responsive" width="${width}" height="${height + captionHeight}">${images}</amp-carousel></div>`));
	});

	article.htmlBody = $.html();
};
