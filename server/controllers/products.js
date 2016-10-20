'use strict';
const fetch = require('../lib/wrap-fetch')(require('node-fetch'), {
	tag: 'barrier-guru',
});

const ammit = require('../lib/ammit');
const {json} = require('fetchres');

const apiKey = process.env.BARRIER_GURU_API_KEY;

const FIVE_YEARS = 5 * 365.25 * 24 * 60 * 60 * 1000;

module.exports = (req, res, next) => {
	const allocationId = req.get('ft-allocation-id') || req.cookies.FTAllocation;
	const sessionId = req.get('ft-session-id') || req.cookies.FTSession;
	const countryCode = req.get('country-code');

	res.vary('ft-allocation-id');
	res.vary('ft-session-id');
	res.vary('country-code');

	module.exports.getProducts({
		allocationId,
		sessionId,
		countryCode,
	}).then(({items, allocation}) => {
		if(!allocationId && allocation) {
			res.cookie('FTAllocation', allocation, {
				domain: 'ft.com',
				maxAge: FIVE_YEARS,
			});
		}

		res.send({items});
	}).catch(next);
};

module.exports.getProducts = ({allocationId, sessionId, countryCode}) =>
	ammit({allocationId, sessionId})
	.then(({abVars, allocation}) => fetch('https://barrier-guru.ft.com/individual', {
		headers: {
			'country-code': countryCode,
			'x-api-key': apiKey,
			'x-ft-ab': abVars,
		},
	})
	.then(json)
	.then(barrier => ({
		items: barrier.offers,
		allocation,
	})));
