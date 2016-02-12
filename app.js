const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const apiKeyMware = require('./server/middleware/keyAuth'); 

app.use(apiKeyMware);

// The search interface route
app.get('/', require('./server/controllers/rss.js'));

app.get('/content/:uuid', require('./server/controllers/amp-page.js'));
app.get('/api/:uuid', require('./server/controllers/jsonItem.js'));

app.listen(port);
console.log('Up and running on port', port);