#!/usr/bin/env node

'use strict';

const midna = require('midna');
const fs = require('fs-promise');
const log = require('@quarterto/instrument-fetch').log;

process.env.NODE_ENV = 'instrument';
const ampPage = require('../server/controllers/amp-page');
process.env.NODE_ENV = 'production';

ampPage.getAndRender(process.argv[2], {
	production: true,
	alwaysFree: true,
	relatedArticleDeduper: [process.argv[2]],
}).then(
	() => fs.writeFile(`fetch-svgs/${process.argv[2]}.svg`, midna(log))
).catch(err => {
	console.error(err.stack || err.toString());
	process.exit(1);
});
