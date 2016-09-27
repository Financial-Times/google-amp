'use strict';

const fetch = require('./wrap-fetch')(require('node-fetch'), {
	tag: 'ammit',
});

const {BadServerResponseError} = require('fetchres');

const FIVE_YEARS = 5 * 365.25 * 24 * 60 * 60 * 1000;

module.exports = (req, res) => {
	if(process.env.BARRIER_AMMIT !== 'true') {
		return Promise.resolve();
	}

	const sessionId = req.cookies.FTSession;
	const allocationId = req.cookies.FTAllocation;

	return fetch('https://ammit-api.ft.com/uk', {
		method: 'HEAD',
		headers: {
			'ft-session-token': sessionId,
			'ft-allocation-id': allocationId,
		},
	})
	.then(r => r.ok ? r : Promise.reject(new BadServerResponseError(r.status)))
	.then(ammitResponse => {
		if(!allocationId && ammitResponse.headers.has('ft-allocation-id')) {
			res.cookie('FTAllocation', ammitResponse.headers.get('ft-allocation-id'), {
				domain: 'ft.com',
				maxAge: FIVE_YEARS,
			});
		}

		return ammitResponse.headers.get('x-ft-ab');
	});
};
