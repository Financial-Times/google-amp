'use strict';

const fetch = require('../fetch/wrap')(require('node-fetch'));
const ammit = require('../ammit');
const {json} = require('fetchres');

const apiKey = process.env.BARRIER_GURU_API_KEY;

const FIVE_YEARS = 5 * 365.25 * 24 * 60 * 60 * 1000;

module.exports = (req, res, next) => {
	const allocationId = req.get('ft-allocation-id') || req.cookies.FTAllocation;
	const sessionId = req.get('ft-session-id') || req.cookies.FTSession;
	const countryCode = req.get('country-code');
	const countryCodeTwoLetters = req.get('country-code-two-letters');
	const continentCode = req.get('continent_code');
	const referer = req.get('referer');
	const userAgent = req.get('user-agent');

	res.vary('ft-allocation-id');
	res.vary('ft-session-id');
	res.vary('country-code');
	res.vary('country-code-two-letters');
	res.vary('continent_code');
	res.vary('referer');
	res.vary('user-agent');

	module.exports.getProducts({
		allocationId,
		sessionId,
		countryCode,
		countryCodeTwoLetters,
		continentCode,
		referer,
		userAgent,
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

module.exports.getProducts = ({allocationId, sessionId, countryCode, countryCodeTwoLetters,
	continentCode, referer, userAgent}) =>
	ammit({allocationId, sessionId, countryCodeTwoLetters, continentCode, referer, userAgent})
	.then(({abVars, allocation}) => fetch('https://barrier-guru.ft.com/barrier', {
		headers: {
			'country-code': countryCode,
			'x-api-key': apiKey,
			'x-ft-ab': abVars,
		},
	})
	.then(json)
	.then(barrier => ({
		items: barrier.offers || [],
		allocation,
	})));
