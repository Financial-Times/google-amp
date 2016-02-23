const fetch = require('node-fetch');
const dateTransform = require('../article-date');

// const env = process.env.NODE_ENV;
const env = 'production';

const apiUrl = (env === "production") ? 'http://api.ft.com' : 'http://test.api.ft.com';
const apiKey = (env === "production") ? process.env.RECOMMENDED_READS_API_KEY : process.env.RECOMMENDED_READS_TEST_API_KEY;
const count = 10;

// Valid arguments are "pop"(popularity), "rel"(relevancy) and "date"
const sort = 'rel';

// supported values for recency are integers representing the maximum number of days to go back and ISO-formatted date-time representing the point after which the events are processed
const recency = 7;

module.exports = (uuid, raven)=> fetch(`${apiUrl}/recommended-reads-api/recommend/contextual?apiKey=${apiKey}&count=${count}&sort=${sort}&recency=${recency}&contentid=${uuid}`)
	.then(response => {
		if (response.status < 200 || response.status >= 300) {
			if (raven) {
				raven.captureMessage('Recommended Reads API call failed', {
					level: 'error',
					extra: {
						response
					}
				});
			}
			const e = Error('Recommended Reads API call failed');
			e.extra = {response};
			throw e;
		}
		return response;
	})
	.then(response => response.json())
	.then(json => json.articles)
	.then(articles => articles.map(article => {
		article.date = dateTransform(article.published, 'related-content__date');
		return article;
	}))

	// Return empty array on failure
	.catch(e => {
		return [];
	});
