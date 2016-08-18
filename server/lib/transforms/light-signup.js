'use strict';

const url = require('url');
const getMiddleParagraph = require('./get-middle-paragraph');

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

const lightSignupMarkup = params => `<div amp-access="NOT session" amp-access-hide>
<amp-iframe
	id="light-signup"
	src="${formatLightSignupUrl(params)}"
	width="auto"
	height="340"
	layout="fixed-height"
	sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
	frameborder="0"
></amp-iframe>
</div>`;

module.exports = function addLightSignup($, params) {
	if(params.enableLightSignup) {
		getMiddleParagraph($).after(lightSignupMarkup(params));
	}

	return $;
};
