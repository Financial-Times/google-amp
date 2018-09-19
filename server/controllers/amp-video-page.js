'use strict';

const nEsClient = require('@financial-times/n-es-client');
const errors = require('http-errors');
module.exports = (req, res, next) => {
  const uuid = req.params.uuid;
  nEsClient.get(uuid)
		.then(
			response => {
        // console.log(response);
				if(response &&
					(!response.originatingParty || response.originatingParty === 'FT') &&
					(!response.type || response.type === 'video')
				) {
					return response;
				}

				throw new errors.NotFound(`${uuid} not found`);
			},
			err => {
				if(err.status === 404) {
					throw new errors.NotFound(`${uuid} not found`);
				}

				if(err.status) {
					reportError(options.raven, err);

					throw new errors.InternalServerError(`Elastic Search error fetching video ${uuid}`);
				}

				throw err;
			}
		)
		// .then(article => articleFlags(article, options))
    .then(video => {
      console.log("videooooo ", video)
			if(req.cookies['amp-access-mock']) {
				// No caching, to allow access mock cookies to be applied immediately
				res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			} else if(req.query.amp_latest_update_time) {
				// Cache live blogs poll requests for one second
				res.setHeader('cache-control', 'public, max-age=1, no-transform');
			} else {
				const oneDay = 24 * 60 * 60;
				const oneWeek = 7 * oneDay;

				res.setHeader('cache-control', `public, max-age=${oneWeek}, no-transform`);
				res.setHeader('surrogate-control', `stale-on-error=${oneWeek}, stale-while-revalidate=${oneDay}`);
			}

			res.render('video', Object.assign({layout: 'layout'}, video));
		})
    .catch(next);
}
