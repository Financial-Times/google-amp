'use strict';

const sanitise = text => text.replace(/[^\w ]/g, '');

module.exports = function trimmedLinks($) {
	$('a').each((i, el) => {
		const $el = $(el);
		const isRelatedBox = !!$el.parents('[data-trackable="related-box"]').length;

		// Ensure text doesn't contain HTML chars
		const text = sanitise($el.text());

		// Ensure URLs don't break out of data attribute
		const href = $el.attr('href').replace('"', '%22');

		if(!$el.attr('data-vars-link-destination')) {
			$el.attr('data-vars-link-destination', href);
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
