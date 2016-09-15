'use strict';

module.exports.canonical = article => {
	switch(process.env.CANONICAL_URL_PHASE) {
		case '0':
			return article.webUrl;
		case '1':
			return `https://www.ft.com/content/${article.id}`;
		case '2':
			throw Error('Vanity URLs not yet supported');
		default:
			throw Error(`Unrecognised CANONICAL_URL_PHASE: ${JSON.stringify(process.env.CANONICAL_URL_PHASE)}`);
	}
};

module.exports.external = uuid => {
	switch(process.env.CANONICAL_URL_PHASE) {
		case '0':
			return `http://www.ft.com/content/${uuid}`;
		case '1':
			return `https://www.ft.com/content/${uuid}`;
		case '2':
			throw Error('Vanity URLs not yet supported');
		default:
			throw Error(`Unrecognised CANONICAL_URL_PHASE: ${JSON.stringify(process.env.CANONICAL_URL_PHASE)}`);
	}
};
