'use strict';

// For now, until ft-concept tags can be turned into a clickable link, remove them as they fail AMP validation
module.exports = $ => {
	$('ft-concept').each((i, el) => {
		const $el = $(el);
		$el.replaceWith($el.text());
	});

	return $;
};
