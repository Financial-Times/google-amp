#!/usr/bin/env node

'use strict';

const nEsClient = require('@financial-times/n-es-client');
const assertEnv = require('@quarterto/assert-env');
const util = require('util');
require('dotenv/config');

assertEnv(['AWS_ACCESS_KEY', 'AWS_SECRET_ACCESS_KEY']);

const query = JSON.parse(process.argv[2]);

nEsClient.search({
	query,
	_source: ['id'],
}).then(
	r => console.log(util.inspect(r, {depth: null, colors: true})),
	e => {
		console.error(e.stack);
		process.exit(1);
	}
);
