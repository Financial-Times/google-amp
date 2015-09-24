var express = require('express');
var port = process.env.PORT || 5000;
var app = express();

// The search interface route
app.get('/', require('./server/controllers/rss.js'));

app.listen(port);
console.log('Up and running on port', port);