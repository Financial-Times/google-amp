'use strict';

const fetch = require('../wrap-fetch')(require('node-fetch'), {
	tag: 'live-blogs',
});

const renderLiveBlog = require('./render');

const url = require('url');
const fetchres = require('fetchres');
const promiseAllObject = require('@quarterto/promise-all-object');

const modifyBlogUrl = query => blogUrl => url.format(Object.assign(
	url.parse(blogUrl),
	{query}
));

const catchupUrl = modifyBlogUrl({action: 'catchup', format: 'json'});
const metaUrl = modifyBlogUrl({action: 'getmeta'});
const configUrl = modifyBlogUrl({action: 'getconfig'});

const getBlogData = getUrl => blogUrl => fetch(getUrl(blogUrl)).then(fetchres.json);

module.exports = (article, options) =>
	promiseAllObject({
		catchup: getBlogData(catchupUrl)(options.overrideBlog || article.webUrl),
		meta: getBlogData(metaUrl)(options.overrideBlog || article.webUrl),
		config: getBlogData(configUrl)(options.overrideBlog || article.webUrl),
	})
	.then(data => renderLiveBlog(article, data, options));
