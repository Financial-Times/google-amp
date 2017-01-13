#!/usr/bin/env node

'use strict';

require('dotenv/config');

const testUUIDs = require('../test/utils/test-uuids');
const getArticle = require('../server/lib/get-article');
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
	uuid => getArticle(uuid)
		.then(({_source}) => {
			const $h = cheerio.load(_source.bodyHTML);
			const $x = cheerio.load(_source.bodyXML);
			const result = {uuid, title: _source.title};

			if($h(selector).length) result.html = $h.html(selector);
			if($x(selector).length) result.xml = $x.html(selector);
			if(result.html || result.xml) return result;
		})))
.then(results => results.filter(Boolean))
.then(results => results.forEach(({uuid, title, html, xml}) => {
	log.uuid(`${title} (${chalk.grey(uuid)})`);
	if(html) {
		log.html('html');
		log.message(formatAndHighlight(html));
	}
	if(xml) {
		log.xml('xml');
		log.message(formatAndHighlight(xml));
	}
	log.end('');
	console.log();
})).catch(err => {
	log.error(err.message || err.toString());
	if(err.stack) log.errorLine(err.stack.replace(err.message, ''));
	console.log();
	process.exit(1);
});
