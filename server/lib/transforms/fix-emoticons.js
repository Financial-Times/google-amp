'use strict';

module.exports = $ => {
	$('amp-img[src]').each((i, el) => {
		const $el = $(el);
		$el.attr('src', $el.attr('src')
			.replace(
				/^(https:\/\/h2.ft.com\/image\/v1\/images\/raw\/)\/wp-content/,
				'$1https://ftalphaville.ft.com/wp-content'
			)
			.replace('assanka_web_chat', 'wp-plugin-ft-web-chat')
		);
	});

	return $;
};
