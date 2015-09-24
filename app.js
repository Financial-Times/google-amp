const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const apiKeyMware = require('./server/middleware/keyAuth'); 

app.use(apiKeyMware);

// The search interface route
app.get('/', require('./server/controllers/rss.js'));

app.listen(port);
console.log('Up and running on port', port);