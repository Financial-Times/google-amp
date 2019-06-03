'use strict';


const url = require('url');
const fetchres = require('fetchres');
const promiseAllObject = require('@quarterto/promise-all-object');
const fetch = require('../fetch/wrap')(require('node-fetch'));
const renderLiveBlog = require('./render');

const modifyBlogUrl = query => blogUrl => url.format(Object.assign(
	url.parse(blogUrl),
	{query}
));

const catchupUrl = modifyBlogUrl({action: 'catchup', format: 'json'});
const metaUrl = modifyBlogUrl({action: 'getmeta'});
const configUrl = modifyBlogUrl({action: 'getconfig'});

const getBlogData = getUrl => blogUrl => fetch(getUrl(blogUrl)).then(fetchres.json);

const liveblogCache = {};

const getLiveBlog = liveblogUrl => promiseAllObject({
	catchup: getBlogData(catchupUrl)(liveblogUrl),
	meta: getBlogData(metaUrl)(liveblogUrl),
	config: getBlogData(configUrl)(liveblogUrl),
});

// how long after the last request to a particular live blog should we poll and
// keep its data. while a user is still reading a live blog they're requesting us
// every 15 seconds, so poll for slightly longer than that and poll every second
// to keep it fresh
const pollBlogFor = 20 * 1000;
const pollBlogEvery = 1 * 1000;

const pollLiveBlog = liveblogUrl => setInterval(() => {
	getLiveBlog(liveblogUrl).then(data => {
		liveblogCache[liveblogUrl].data = data;
	});
}, pollBlogEvery);

const stopPolling = liveblogUrl => {
	if(liveblogCache[liveblogUrl]) {
		clearInterval(liveblogCache[liveblogUrl].pollInterval);
		clearTimeout(liveblogCache[liveblogUrl].pollStopTimeout);
		liveblogCache[liveblogUrl] = undefined;
	}
};

// https://jira.ft.com/browse/AT-722
const rewriteAlphavilleURL = blogUrl => {
	const parsed = url.parse(blogUrl, true);
	if(parsed.host === 'ftalphaville.ft.com') {
		parsed.host = 'ftalphaville-wp.ft.com';
		const rewritten = url.format(parsed);
		console.log(`Rewrote ${blogUrl} to ${rewritten}`);
		return rewritten;
	}

	return blogUrl;
};

module.exports = (article, options) => {
	const liveblogUrl = rewriteAlphavilleURL(options.overrideBlog || article.webUrl);
	let results;
	let pollInterval;

	if(options.lastUpdate && liveblogCache[liveblogUrl] && liveblogCache[liveblogUrl].data) {
		clearTimeout(liveblogCache[liveblogUrl].pollStopTimeout);
		results = liveblogCache[liveblogUrl].data;
		({pollInterval} = liveblogCache[liveblogUrl]);
	} else {
		results = getLiveBlog(liveblogUrl);
		if(options.lastUpdate) {
			pollInterval = pollLiveBlog(liveblogUrl);
		}
	}

	liveblogCache[liveblogUrl] = {
		pollInterval,
		pollStopTimeout: setTimeout(stopPolling, pollBlogFor, liveblogUrl),
	};

	return Promise.resolve(results).then(data => {
		if(options.lastUpdate && liveblogCache[liveblogUrl]) {
			liveblogCache[liveblogUrl].data = data;
		}

		return renderLiveBlog(article, data, options);
	});
};
