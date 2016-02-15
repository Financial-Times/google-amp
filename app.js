const express = require('express');
const logger = require('morgan');
const port = process.env.PORT || 5000;
const app = express();

app.use(logger(app.get('env') === 'development' ? 'dev' : 'combined'));

// The search interface route
app.get('/', require('./server/controllers/rss.js'));

app.get('/content/:uuid', require('./server/controllers/amp-page.js'));
app.get('/api/:uuid', require('./server/controllers/jsonItem.js'));

if(app.get('env') === 'development') {
	app.use(require('errorhandler')());
}

app.listen(port, () => console.log('Up and running on port', port));
