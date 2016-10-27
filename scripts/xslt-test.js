#!/usr/bin/env node

'use strict';

const fs = require('fs-promise');
const articleXslt = require('../server/lib/article-xslt');
const chalk = require('chalk');
const {clearScreen, cursorHide, cursorShow} = require('ansi-escapes');
const {highlight} = require('emphasize');
const {html: htmlBeautify} = require('js-beautify');
const {watch} = require('chokidar');
const monokai = require('@quarterto/emphasize-monokai-sheet');

const path = process.argv[2];

process.stdout.write(cursorHide);
process.on('exit', () => process.stdout.write(cursorShow));

const xsltOutput = () => {
	fs.readFile(path, 'utf8')
		.then(xml => articleXslt(xml, 'main', {
			renderTOC: 0,
			brightcoveAccountId: process.env.BRIGHTCOVE_ACCOUNT_ID,
			brightcovePlayerId: 'default',
		}))
		.then(html => {
			process.stdout.write(clearScreen);
			console.log(
				highlight(
					'html',
					htmlBeautify(html, {
						wrap_line_length: process.stdout.columns,
						wrap_attributes: 'force',
					}),
					monokai
				).value
			);
		})
		.catch(e => console.error(`${chalk.red('✘')} ${e.stack || e.message || e}`));
};

fs.watch(path, xsltOutput);
watch('./server/stylesheets').on('change', xsltOutput);
xsltOutput();
