'use strict';

module.exports = $ => {
	// find image in the body
	const $firstMainImage = $('figure.article-image--full, figure.article-image--center, ft-slideshow').eq(0);

	const exists = !!$firstMainImage.length;
	const isFirstChild = !$firstMainImage.prev().length;
	const hasNoParent = !$firstMainImage.parent().length;
	const parentIsFirstChild = !$firstMainImage.parent().prev().length;

	// check that it is the first element in the body
	if (exists && isFirstChild && (hasNoParent || parentIsFirstChild)) {
		return $.html($firstMainImage.remove());
	}
};
