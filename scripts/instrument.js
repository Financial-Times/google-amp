#!/usr/bin/env node

'use strict';

process.env.NODE_ENV = 'instrument';

const wrapFetch = require('../server/lib/wrap-fetch');
const ampPage = require('../server/controllers/amp-page');

process.env.NODE_ENV = 'production';

ampPage.getAndRender(process.argv[2], {
	production: true,
	alwaysFree: true,
	relatedArticleDeduper: [process.argv[2]],
}).then(
	() => console.log(wrapFetch.log),
	err => {
		console.error(err.stack || err.toString());
		process.exit(1);
	}
);
