'use strict';

const express = require('@financial-times/n-express');
const logger = require('morgan');
const raven = require('raven');
const cookieParser = require('cookie-parser');
const assertHerokuEnv = require('@quarterto/assert-heroku-env');
const assertEnv = require('@quarterto/assert-env');
const ftwebservice = require('express-ftwebservice');
const path = require('path');
const os = require('os');

const cors = require('./lib/cors');
const handlebars = require('./lib/templating/handlebars');
const pkg = require('../package.json');

const app = express({
	systemCode: 'google-amp',
	withFlags: true,
});

const isDevelopment = app.get('env') === 'development';
const isProduction = app.get('env') === 'production';

Object.assign(app, {
	isDevelopment,
	isProduction,
});

ftwebservice(app, {
	manifestPath: path.join(__dirname, '../package.json'),
	about: {
		schemaVersion: 1,
		name: 'google-amp',
		purpose: 'Serve Google AMP pages',
		audience: 'public',
		primaryUrl: 'https://amp.ft.com',
		serviceTier: 'bronze',
		appVersion: pkg.version,
		contacts: [
			{
				name: 'Richard Still',
				email: 'richard.still@ft.com',
			},
			{
				name: 'Bren Brightwell',
				email: 'bren.brightwell@ft.com',
			},
			{
				name: 'Rowan Beentje',
				email: 'rowan.beentje@ft.com',
			},
		],
	},
	healthCheck: () => Promise.all([
		require('./health/elastic-search'),
	].map(check => check())),
});

let ravenClient;

if(isProduction) {
	assertEnv(['SENTRY_DSN']);
	ravenClient = new raven.Client(process.env.SENTRY_DSN, {
		release: pkg.version,
		name: process.env.HEROKU_APP_NAME || os.hostname(),
		extra: {
			env: process.env,
		},
		tags: {},
	});
	ravenClient.patchGlobal(() => process.exit(1));
}

assertHerokuEnv(warnings => {
	if(ravenClient) {
		ravenClient.captureMessage(warnings, {level: 'warning'});
	} else {
		// eslint-disable-next-line no-console
		console.warn('Warning:', warnings);
	}
});

if(isProduction) {
	app.use(raven.middleware.express.requestHandler(ravenClient));
	app.use((req, res, next) => {
		ravenClient.setExtraContext(raven.parsers.parseRequest(req));
		req.raven = ravenClient;
		next();
	});
}

handlebars.express(app);

// Trust headers such as x-forwarded-for-proto from Heroku and Fastly.
app.enable('trust proxy');

// Remove the x-powered-by response header.
app.disable('x-powered-by');

// Redirect http requests to https.
app.get('*', (req, res, next) => {
	if(req.secure) {
		return next();
	}

	if(isProduction) {
		res.redirect(301, `https://amp.ft.com${req.url}`);
	} else {
		res.redirect(301, `https://${req.hostname}${req.url}`);
	}
});

// Add header for HSTS policy.
app.use((req, res, next) => {
	if(req.secure) {
		res.set('strict-transport-security', 'max-age=63072000; includeSubDomains; preload');
	}

	next();
});

// before logger to avoid logging robots.txt requests
app.get('/robots.txt', (req, res) => {
	res.send(`user-agent: *
disallow: /
allow: /content/*
allow: /products
allow: /static/*`);
});

app.use(logger(process.env.LOG_FORMAT || (isDevelopment ? 'dev' : 'combined')));
app.use(cookieParser());
app.use('/static', express.static('static'));

if(!isProduction) {
	app.get('/', require('./controllers/redirect.js'));
}

app.get('/content/:uuid', require('./controllers/amp-page.js'));
app.get('/products', cors, require('./controllers/products.js'));

app.all('/amp-access-mock/:type(access|pingback)', cors, require('./controllers/access-mock.js'));
app.all('/amp-access-mock/:type', require('./controllers/access-mock.js'));

app.get('/_access_mock', (req, res) => {
	res.redirect(301, '/amp-access-mock/enable');
});

app.get('/_access_mock/prevent-access', (req, res) => {
	res.redirect(301, '/amp-access-mock/prevent-access');
});

app.get('/_access_mock/clear', (req, res) => {
	res.redirect(301, '/amp-access-mock/clear');
});

if(isDevelopment) {
	app.all('/analytics', require('./controllers/analytics-proxy.js'));
	app.use(require('errorhandler')());
} else {
	app.use(raven.middleware.express.errorHandler(ravenClient));
	app.use((err, req, res, next) => {
		const status = err.status || err.statusCode || err.status_code;

		if(status === 404) {
			res.setHeader('cache-control', 'public, max-age=30, no-transform');
			res.setHeader('surrogate-control', 'stale-on-error=86400, stale-while-revalidate=300');
			res.sendStatus(404);
		} else {
			res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
			next(err);
		}
	});
}

module.exports = app;
