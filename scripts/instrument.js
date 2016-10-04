#!/usr/bin/env node

'use strict';

const midna = require('midna');
const fs = require('fs-promise');
const log = require('@quarterto/instrument-fetch').log;

process.env.NODE_ENV = 'instrument';
const ampPage = require('../server/controllers/amp-page');
process.env.NODE_ENV = 'production';

const filename = `fetch-svgs/${process.argv[2]}-${Date.now()}.svg`;

ampPage.getAndRender(process.argv[2], {
	production: true,
	showEverything: true,
	relatedArticleDeduper: [process.argv[2]],
	enableLiveBlogs: true,
}).then(
	() => fs.writeFile(filename, midna(log))
).then(
	() => console.log(`Written ${filename}`),
	err => {
		console.error(err.stack || err.toString());
		process.exit(1);
	}
);
