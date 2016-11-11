#!/usr/bin/env node

'use strict';

const herokuMemoryLimit = require('@quarterto/heroku-memory-limit');

const limit = Math.floor(herokuMemoryLimit() / 2);

console.log([
	'--optimize_for_size',
	'--gc_interval=100',
	'--max_semi_space_size=1',
	`--max_old_space_size=${limit}`,
	`--max_executable_size=${limit}`,
].join(' '));
