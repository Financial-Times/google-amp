'use strict';

module.exports = $ => {
	// find image or slideshow in the body
	const $firstMainImage = $('figure.article-image--full, figure.article-image--center, ft-slideshow').eq(0);
	let mainImageHtml;

	// check that it is the first element in the body
	if(
		$firstMainImage.length &&
			!$firstMainImage.prev().length &&
			(!$firstMainImage.parent() || !$firstMainImage.parent().prev().length)
	) {
		mainImageHtml = $.html($firstMainImage.remove());
	}

	return {
		mainImageHtml,
		bodyHtml: $.html(),
	};
};
