'use strict';
const fetch = require('../lib/wrap-fetch')(require('node-fetch'), {
	tag: 'barrier-guru',
});

const ammit = require('../lib/ammit');
const {json} = require('fetchres');
const apiKey = process.env.BARRIER_GURU_API_KEY;

module.exports = (req, res) =>
	ammit(req, res)
	.then(ammitVars => fetch('https://barrier-guru.ft.com/individual', {
		headers: {
			'country-code': req.get('country-code'),
			'x-api-key': apiKey,
			'x-ft-ab': ammitVars,
		},
	})
	.then(json)
	.then(barrier => {
		res.send({
			items: barrier.offers,
		});
	}));
