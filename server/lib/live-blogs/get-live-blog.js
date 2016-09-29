'use strict';

const fetch = require('../wrap-fetch')(require('node-fetch'), {
	tag: 'live-blogs',
});

const renderLiveBlog = require('./render');

const url = require('url');
const fetchres = require('fetchres');

const getCatchupUrl = blogUrl => url.format(Object.assign(
	url.parse(blogUrl),
	{query: {action: 'catchup', format: 'json'}}
));

const getCatchupJson = blogUrl => fetch(getCatchupUrl(blogUrl)).then(fetchres.json);

module.exports = (article, options) =>
	getCatchupJson(article.webUrl)
	.then(catchup => renderLiveBlog(article, catchup, options));
