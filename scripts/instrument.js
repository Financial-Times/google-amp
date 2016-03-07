#!/usr/bin/env node

'use strict';

const midna = require('midna');
const fs = require('fs-promise');

process.env.NODE_ENV = 'instrument';

const wrapFetch = require('../server/lib/wrap-fetch');
const ampPage = require('../server/controllers/amp-page');

process.env.NODE_ENV = 'production';

ampPage.getAndRender(process.argv[2], {
	production: true,
	alwaysFree: true,
	relatedArticleDeduper: [process.argv[2]],
}).then(
	() => fs.writeFile(`fetch-svgs/${process.argv[2]}.svg`, midna(wrapFetch.log)),
	err => {
		console.error(err.stack || err.toString());
		process.exit(1);
	}
);
