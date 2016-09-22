'use strict';
const fetch = require('../lib/wrap-fetch')(require('node-fetch'), {
	tag: 'barrier-guru',
});

const {json} = require('fetchres');
const apiKey = process.env.BARRIER_GURU_API_KEY;

module.exports = (req, res) =>
	fetch('https://barrier-guru.ft.com/individual', {
		headers: {
			'x-api-key': apiKey,
		},
	})
	.then(json)
	.then(barrier => {
		res.send({
			items: barrier.offers,
		});
	});
