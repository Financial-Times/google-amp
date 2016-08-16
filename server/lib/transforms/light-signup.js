'use strict';

const url = require('url');
const getMiddleParagraph = require('./get-middle-paragraph');

const formatLightSignupUrl = options => url.format(Object.assign(
	url.parse(options.lightSignupUrl),
	{
		query: {
			article: options.uuid,
			product: options.lightSignupProduct,
			mailinglist: options.lightSignupMailinglist,
		},
	}
));

const lightSignupMarkup = options => `<div amp-access="NOT session" amp-access-hide>
<amp-iframe
	src="${formatLightSignupUrl(options)}"
	width="auto"
	height="340"
	layout="fixed-height"
	sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
	frameborder="0"
></amp-iframe>
</div>`;

module.exports = function addLightSignup($, options) {
	if(options.enableLightSignup) {
		getMiddleParagraph($).after(lightSignupMarkup(options));
	}

	return $;
};
