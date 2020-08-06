'use strict';

const fetch = require('../lib/fetch/wrap')(require('node-fetch'));
const ammit = require('../lib/ammit');
const {json} = require('fetchres');
const {itemTransform} = require('../lib/item-transform');

const apiKey = process.env.BARRIER_GURU_API_KEY;

const FIVE_YEARS = 5 * 365.25 * 24 * 60 * 60 * 1000;

const getProducts = async (options) => {
	const { countryCode } = options;
	const { abVars, allocation } = await ammit(options);
	const headers = {
		'x-api-key': apiKey,
		'x-ft-ab': abVars,
	};

	if (countryCode) {
		headers['country-code'] = countryCode;
	}

	const response = await fetch('https://barrier-guru.ft.com/barrier', { headers });
	const barrier = await json(response);

	const items = barrier.offers
		.filter(offer => offer.name !== 'subscription-premium-digital-variant')
		.map(itemTransform);

	return { items, allocation };
};

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

	getProducts({
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
