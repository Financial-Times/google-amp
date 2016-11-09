'use strict';

const herokuCluster = require('@quarterto/heroku-cluster');
const app = require('./server');

herokuCluster({
	defaultPort: 5000,
	app,
});
