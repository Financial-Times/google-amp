'use strict';

module.exports = function trimmedLinks($) {
	$('a').each((i, el) => {
		const $el = $(el);
		const isRelatedBox = !!$el.parents('[data-trackable="related-box"]').length;
		const text = $el.text();

		$el.attr('data-vars-link-destination', $el.attr('href'));
		$el.attr('data-vars-link-type', (isRelatedBox ? 'related-box' : 'inline'));
		if(text) {
			$el.attr('data-vars-link-text', text);
		}
	});

	return $;
};
