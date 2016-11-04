'use strict';

const herokuV8Memory = require('@quarterto/heroku-v8-memory');
const herokuCluster = require('@quarterto/heroku-cluster');
const app = require('./server');

herokuV8Memory();
herokuCluster({
	defaultPort: 5000,
	app,
});
