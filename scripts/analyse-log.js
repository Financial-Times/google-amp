#!/usr/bin/env node

var gaussian = require('@quarterto/gaussian');
var percentile = require('@quarterto/gaussian-percentile');
var fs = require('fs');

var data = fs.readFileSync(process.argv[2], 'utf8')
			.split('\n')
			.map(l => parseFloat(l))
			.filter(n => !isNaN(n));

var ms = n => n.toFixed(2) + 'ms';
var padLeft = (s, n, p) => Array(n - s.length + 1).join(p) + s;
var padRight = (s, n, p) => s + Array(n - s.length + 1).join(p);


var gauss = gaussian(data);

var stats = {
	min: Math.min.apply(Math, data),
	max:  Math.max.apply(Math, data),
	mean: gauss.μ,
	sdev: gauss.σ,
	'75th': percentile(gauss.μ, gauss.σ, 75),
	'90th': percentile(gauss.μ, gauss.σ, 90),
	'95th': percentile(gauss.μ, gauss.σ, 95),
	'99th': percentile(gauss.μ, gauss.σ, 99),
};

for(var stat in stats) {
	console.log(
		padRight(stat + ':', 6, ' ') +
		padLeft(ms(stats[stat]), 8, ' ')
	);
}
