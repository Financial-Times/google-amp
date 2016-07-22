'use strict';

const url = require('url');

const formatLightSignupUrl = params => url.format(Object.assign(
	url.parse(params.lightSignupUrl),
	{
		query: {
			article: params.uuid,
			product: params.lightSignupProduct,
			mailinglist: params.lightSignupMailinglist,
		},
	}
));

const lightSignupMarkup = params => `<amp-iframe
	src="${formatLightSignupUrl(params)}"
	width="auto"
	height="340"
	layout="fixed-height"
	sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
	frameborder="0"
></amp-iframe>`;

module.exports = function addLightSignup($, params) {
	if(params.enableLightSignup) {
		const paras = $.root().children('p');

		// Zero-indexed position
		const idealPosition = Math.max(3, Math.floor(paras.length / 2)) - 1;
		const maxPosition = paras.length - 1;

		let position = idealPosition;

		// Try to position in the middle of the article, working up until a suitable
		// place can be found
		while(!paras.eq(position).next().is('p') && position >= 3) {
			position--;
		}

		// If no place can be found in the first half of the article, place at some point
		// after the middle
		if(position < 3) {
			position = idealPosition;
			while(!paras.eq(position).next().is('p') && position < maxPosition) {
				position++;
			}
		}

		paras.eq(position).after(lightSignupMarkup(params));
	}

	return $;
};
