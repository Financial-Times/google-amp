'use strict';

module.exports = $ => {
	$('amp-img[src]').each((i, el) => {
		const $el = $(el);
		$el.attr('src', $el.attr('src').replace('assanka_web_chat', 'wp-plugin-ft-web-chat'));
	});

	return $;
};
