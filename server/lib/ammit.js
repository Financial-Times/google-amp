'use strict';

const fetch = require('./wrap-fetch')(require('node-fetch'), {
	tag: 'ammit',
});

const {BadServerResponseError} = require('fetchres');


module.exports = ({allocationId, sessionId}) => {
	if(process.env.BARRIER_AMMIT !== 'true') {
		return Promise.resolve({});
	}

	return fetch('https://ammit-api.ft.com/uk', {
		method: 'HEAD',
		headers: {
			'ft-session-token': sessionId,
			'ft-allocation-id': allocationId,
		},
	})
	.then(r => r.ok ? r : Promise.reject(new BadServerResponseError(r.status)))
	.then(res => ({
		abVars: res.headers.get('x-ft-ab'),
		allocation: res.headers.get('ft-allocation-id'),
	}));
};
