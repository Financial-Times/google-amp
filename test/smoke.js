'use strict';

module.exports = [
	// Health check
	{
		timeout: 10000,
		urls: {
			'/__health': 200,
		},
	},

	// Kitchen sink article with a variety of components
	{
		timeout: 10000,
		urls: {
			'/content/146da558-4dee-11e3-8fa5-00144feabdc0': {
				status: 200,
				waitUntil: 'load',
				pageErrors: 2, //some URLs don't work on 3002 and so error
				cacheHeaders: true,
				performance: 10000,
				elements: {
					article: true,
					'h1.headline': 'Kitchenus sinkus articlus',
				},
			},
		},
	},
];
