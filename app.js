const express = require('express');
const logger = require('morgan');
const raven = require('raven');
const cookieParser = require('cookie-parser');
const assertEnv = require('@quarterto/assert-env');

const port = process.env.PORT || 5000;
const app = express();

assertEnv([
	'AWS_ACCESS_KEY',
	'AWS_SECRET_ACCESS_KEY',
	'BRIGHTCOVE_ACCOUNT_ID',
	'BRIGHTCOVE_PLAYER_ID',
	'ELASTIC_SEARCH_URL',
	'SENTRY_DSN',
	'SPOOR_API_KEY'
]);

const ravenClient = new raven.Client(process.env.SENTRY_DSN);

if(app.get('env') === 'production') {
	app.use(raven.middleware.express.requestHandler(ravenClient));
	ravenClient.patchGlobal(() => process.exit(1));
}

app.use(logger(app.get('env') === 'development' ? 'dev' : 'combined'));
app.use(cookieParser());

app.get('/content/:uuid', require('./server/controllers/amp-page.js'));
app.get('/api/:uuid', require('./server/controllers/jsonItem.js'));

app.get('/_article_test', (req, res) => {
	res.cookie('amp_article_test', '1');
	res.sendStatus(204);
});
app.get('/_article_test/clear', (req, res) => {
	res.clearCookie('amp_article_test');
	res.sendStatus(204);
});

if(app.get('env') === 'development') {
	app.all('/analytics', require('./server/controllers/analytics-proxy.js'));
	app.use(require('errorhandler')());
} else if(app.get('env') === 'production') {
	app.use(raven.middleware.express.errorHandler(ravenClient));
}

app.all('/analytics/config.json', require('./server/controllers/analytics-config.js'));

app.listen(port, () => console.log('Up and running on port', port));
