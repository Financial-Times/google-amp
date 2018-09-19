'use strict';

const nEsClient = require('@financial-times/n-es-client');
const errors = require('http-errors');
module.exports = (req, res, next) => {
  const uuid = req.params.uuid;
  nEsClient.get(uuid)
		.then(
			response => {
        console.log(response);
				if(response &&
					(!response.originatingParty || response.originatingParty === 'FT') &&
					(!response.type || response.type === 'article')
				) {
					return response;
				}

				throw new errors.NotFound(`not found`);
			},
			err => {
				if(err.status === 404) {
					throw new errors.NotFound(`not found`);
				}

				if(err.status) {
					reportError(options.raven, err);

					throw new errors.InternalServerError(`Elastic Search error fetching article ${uuid}`);
				}

				throw err;
			}
		)
		.then(article => articleFlags(article, options))
		.then(article => {
			if(article.enableLiveBlogs && isLiveBlog(article.webUrl)) {
				return getLiveBlog(article, options);
			}

			return article;
		})
    .catch(next);
}
