'use strict';

const fetchres = require('fetchres');

const fetch = require('../../fetch/wrap')(require('node-fetch'), {
	tag: 'unfurl-videos',
});

module.exports = videoId => fetch(`https://next-media-api.ft.com/v1/${videoId}`)
	.then(fetchres.json);
