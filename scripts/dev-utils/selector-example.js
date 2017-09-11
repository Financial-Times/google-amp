#!/usr/bin/env node

'use strict';

require('dotenv/config');

const testUUIDs = require('../test/utils/test-uuids');
const nEsClient = require('@financial-times/n-es-client');
const cheerio = require('cheerio');
const {highlight} = require('emphasize');
const {html: htmlBeautify} = require('js-beautify');
const monokai = require('@quarterto/emphasize-monokai-sheet');
const symbolLogger = require('@quarterto/symbol-logger');
const chalk = require('chalk');

const selector = process.argv[2];

const log = symbolLogger({
	message: {
		symbol: '│',
		format: 'white',
	},
	uuid: {
		symbol: '⎘',
		format: 'cyan',
	},
	html: {
		symbol: '≶',
		format: 'green',
	},
	xml: {
		symbol: '≷',
		format: 'magenta',
	},
	end: '╘',
	error: {
		symbol: '✘',
		format: 'red',
	},
	errorLine: {
		symbol: '│',
		format: 'red',
		formatLine: 'grey',
	},
});

const formatAndHighlight = html => highlight('html', htmlBeautify(html, {
	wrap_line_length: Math.floor(0.75 * process.stdout.columns),
	wrap_attributes: 'force',
}), monokai).value;

Promise.all(testUUIDs.map(
	uuid => nEsClient.get(uuid)
		.then(article => {
			const $h = cheerio.load(article.bodyHTML);
			const result = {uuid, title: article.title};

			if($h(selector).length) {
				return Object.assign({
					html: $h.html(selector),
				}, result);
			}
		})))
.then(results => results.filter(Boolean))
.then(results => {
	if(!results.length) {
		throw new Error('nothing found');
	}

	results.forEach(({uuid, title, html}) => {
		log.uuid(`${title} (${chalk.grey(uuid)})`);
		if(html) {
			log.html('html');
			log.message(formatAndHighlight(html));
		}
		log.end('');
		console.log();
	});
}).catch(err => {
	log.error(err.message || err.toString());
	if(err.stack) log.errorLine(err.stack.replace(err.message, ''));
	console.log();
	process.exit(1);
});
