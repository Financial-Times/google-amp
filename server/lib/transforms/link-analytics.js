'use strict';

module.exports = function trimmedLinks($) {
	$('a').each((i, el) => {
		const $el = $(el);
		const isRelatedBox = !!$el.parents('[data-trackable="related-box"]').length;
		const text = $el.text();

		if(!$el.attr('data-vars-link-destination')) {
			$el.attr('data-vars-link-destination', $el.attr('href'));
		}

		if(!$el.attr('data-vars-link-type')) {
			$el.attr('data-vars-link-type', (isRelatedBox ? 'related-box' : 'inline'));
		}

		if(!$el.attr('data-vars-link-text') && text) {
			$el.attr('data-vars-link-text', text);
		}
	});

	return $;
};
