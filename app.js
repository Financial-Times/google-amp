const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const app = express();

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
}

app.all('/analytics/config.json', require('./server/controllers/analytics-config.js'));

app.listen(port, () => console.log('Up and running on port', port));
