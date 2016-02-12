'use strict';

module.exports = function ($) {

	const tocHtml = $.html($('.article__toc').remove());

	// find image or slideshow in the body
	const $firstMainImage = $('figure.article-image--full, figure.article-image--center, ft-slideshow').eq(0);
	let mainImageHtml;

	// check that it is the first element in the body
	if (
		$firstMainImage.length && !$firstMainImage.prev().length
	) {
		mainImageHtml = $.html($firstMainImage.remove());
	}

	let resultObject = {
		mainImageHtml: mainImageHtml,
		tocHtml: tocHtml
	};

	resultObject.bodyHtml = $.html();

	return resultObject;
}
