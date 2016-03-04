#!/usr/bin/env node

const gaussian = require('@quarterto/gaussian');
const percentile = require('@quarterto/gaussian-percentile');
const fs = require('fs');
const padStart = require('lodash.padstart');
const padEnd = require('lodash.padend');

const data = fs.readFileSync(process.argv[2], 'utf8')
			.split('\n')
			.map(l => parseFloat(l))
			.filter(n => !isNaN(n));

const ms = n => `${n.toFixed(2)}ms`;

const gauss = gaussian(data);

const stats = {
	min: Math.min.apply(Math, data),
	max: Math.max.apply(Math, data),
	mean: gauss.μ,
	sdev: gauss.σ,
	'75th': percentile(gauss.μ, gauss.σ, 75),
	'90th': percentile(gauss.μ, gauss.σ, 90),
	'95th': percentile(gauss.μ, gauss.σ, 95),
	'99th': percentile(gauss.μ, gauss.σ, 99),
};

Object.keys(stats).forEach(stat => {
	console.log(`${padEnd(`${stat}:`, 6, ' ')}${padStart(ms(stats[stat]), 10, ' ')}`);
});
