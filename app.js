'use strict';
const express = require('express');
const logger = require('morgan');
const raven = require('raven');
const cookieParser = require('cookie-parser');
const assertHerokuEnv = require('@quarterto/assert-heroku-env');
const assertEnv = require('@quarterto/assert-env');
const ftwebservice = require('express-ftwebservice');
const path = require('path');
const os = require('os');
const pkg = require('./package.json');

const port = process.env.PORT || 5050;
const app = express();

ftwebservice(app, {
	manifestPath: path.join(__dirname, 'package.json'),
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
				name: 'Matthew Brennan',
				email: 'matthew.brennan@ft.com',
			},
			{
				name: 'George Crawford',
				email: 'george.crawford@ft.com',
			},
		],
	},
	healthCheck: () => Promise.all([
		require('./server/health/elastic-search'),
	].map(check => check())),
});

let ravenClient;

if(app.get('env') === 'production') {
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
		console.warn('Warning:', warnings);
	}
});

if(app.get('env') === 'production') {
	app.use(raven.middleware.express.requestHandler(ravenClient));
	app.use((req, res, next) => {
		ravenClient.setExtraContext(raven.parsers.parseRequest(req));
		req.raven = ravenClient;
		next();
	});
}

app.use(logger(process.env.LOG_FORMAT || (app.get('env') === 'development' ? 'dev' : 'combined')));
app.use(cookieParser());
app.use('/static', express.static('static'));


app.get('/content/:uuid', require('./server/controllers/amp-page.js'));
app.get('/api/:uuid', require('./server/controllers/json-item.js'));

app.all('/amp-access-mock', require('./server/controllers/access-mock.js'));
app.get('/_access_mock', (req, res) => {
	res.redirect(301, '/amp-access-mock?type=enable');
});
app.get('/_access_mock/clear', (req, res) => {
	res.redirect(301, '/amp-access-mock?type=clear');
});

if(app.get('env') === 'development') {
	app.all('/analytics', require('./server/controllers/analytics-proxy.js'));
	app.use(require('errorhandler')());
} else if(app.get('env') === 'production') {
	app.use(raven.middleware.express.errorHandler(ravenClient));
	app.use((err, req, res, next) => {
		const status = err.status || err.statusCode || err.status_code;
		if(status === 404) {
			res.sendStatus(404);
		} else {
			next(err);
		}
	});
}

app.all('/analytics/config.json', require('./server/controllers/analytics-config.js'));

app.listen(port, () => console.log('Up and running on port', port));
