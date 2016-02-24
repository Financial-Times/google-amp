const api = require('next-ft-api-client');
const dateTransform = require('../article-date');
const sanitizeImage = require('../sanitize-image');
const moreOnCount = 5;

const getArticles = metadatum => api.search({
	filter: ['metadata.idV1', metadatum.idV1],

		// Fetch twice as many as we need, to allow for deduping
	count: moreOnCount * 2,
	fields: [
		'id',
		'title',
		'metadata',
		'summaries',
		'mainImage',
		'publishedDate',
	],
})
	.then(res => res.filter(article => article.title)
			.map(article => {
				return {
					date: dateTransform(article.publishedDate, 'more-ons__date'),
					id: article.id,
					title: article.title,
					summary: Array.isArray(article.summaries) ? article.summaries[0] : null,
					image: sanitizeImage(article.mainImage),
				};
			})
	)
	.then(res => {
		return {
			key: metadatum.idV1,
			type: metadatum.type,
			taxonomy: metadatum.taxonomy,
			title: metadatum.prefLabel,
			articles: res,
		};
	})
	.catch(e => {
		return {
			articles: [],
			error: e,
		};
	});

const addTitle = metadatum => {
	let type;

	switch(metadatum.taxonomy) {
	case 'authors':
		type = 'from';
		break;
	case 'sections':
		type = 'in';
		break;
	case 'genre':
		type = '';
		break;
	default:
		type = 'on';
	}

	metadatum.type = `Latest ${type}`;
	return metadatum;
};


module.exports = (article, raven) => {
	const promises = article.metadata.filter(metadatum => metadatum.primary)
		.map(addTitle)
		.map(getArticles);

	return Promise.all(promises)
		.then(moreOns => {
			const deduped = [article.id];

			moreOns.forEach(moreOn => {
				if(moreOn.error) {
					if(raven) {
						raven.captureMessage('More-Ons API call failed', {
							level: 'error',
							extra: {moreOn},
						});
					}
					return;
				}

				moreOn.articles = moreOn.articles.filter(item => {
					if(deduped.indexOf(item.id) >= 0) return false;

					deduped.push(item.id);
					return true;
				})
				.slice(0, moreOnCount);
			});

			return moreOns.filter(moreOn => moreOn.articles.length);
		})
		.then(moreOns => {
			article.moreOns = moreOns;
		});
};
