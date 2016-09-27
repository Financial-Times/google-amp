#!/usr/bin/env node

'use strict';

const midna = require('midna');
const fs = require('fs-promise');
const log = require('@quarterto/instrument-fetch').log;

process.env.NODE_ENV = 'instrument';
const products = require('../server/controllers/products');
process.env.NODE_ENV = 'production';

products.getProducts({}).then(
	() => fs.writeFile(`fetch-svgs/products-${Date()}.svg`, midna(log))
).catch(err => {
	console.error(err.stack || err.toString());
	process.exit(1);
});
