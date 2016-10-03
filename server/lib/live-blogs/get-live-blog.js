'use strict';

const fetch = require('../wrap-fetch')(require('node-fetch'), {
	tag: 'live-blogs',
});

const renderLiveBlog = require('./render');

const url = require('url');
const fetchres = require('fetchres');

const modifyBlogUrl = query => blogUrl => url.format(Object.assign(
	url.parse(blogUrl),
	{query}
));

const catchupUrl = modifyBlogUrl({action: 'catchup', format: 'json'});
const metaUrl = modifyBlogUrl({action: 'getmeta'});

const getBlogData = getUrl => blogUrl => fetch(getUrl(blogUrl)).then(fetchres.json);

module.exports = (article, options) =>
	Promise.all([
		getBlogData(catchupUrl)(options.overrideBlog || article.webUrl),
		getBlogData(metaUrl)(options.overrideBlog || article.webUrl),
	])
	.then(([catchup, meta]) => renderLiveBlog(article, {catchup, meta}, options));
