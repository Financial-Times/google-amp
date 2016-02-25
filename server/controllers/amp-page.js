const getArticle = require('../lib/getArticle');
const addStoryPackage = require('../lib/related-content/story-package');
const addMoreOns = require('../lib/related-content/more-ons');
const renderArticle = require('../lib/render-article');
const transformArticle = require('../lib/transformEsV3Item.js');
const isFree = require('../lib/article-is-free');
const errors = require('http-errors');

function getAndRender(uuid, options) {
	return getArticle(uuid)
		.then(response => response._source ? transformArticle(response._source) : Promise.reject(new errors.NotFound()))
		.then(article => (options.alwaysFree || isFree(article)) ? article : Promise.reject(new errors.NotFound()))
		.then(article => Promise.all([
			addStoryPackage(article, options),
			addMoreOns(article, options),
		]).then(() => article))
		.then(data => {
			data.SOURCE_PORT = options.production ? '' : ':5000';
			return data;
		})
		.then(data => renderArticle(data, {precompiled: options.production}));
}

module.exports = (req, res, next) => {
	getAndRender(req.params.uuid, {
		production: req.app.get('env') === 'production',
		alwaysFree: req.app.get('env') === 'development' || req.cookies.amp_article_test,
		raven: req.raven,
		relatedArticleDeduper: [req.params.uuid],
	})
		.then(content => {
			res.setHeader('cache-control', 'public, max-age=30');
			res.send(content);
		})
		.catch(next);
};

if(module === require.main) {
	getAndRender(process.argv[2], {
		production: false,
		alwaysFree: true,
		relatedArticleDeduper: [process.argv[2]],
	}).then(
		rendered => process.stdout.write(rendered),
		err => {
			console.error(err.stack || err.toString());
			process.exit(1);
		}
	);
}
