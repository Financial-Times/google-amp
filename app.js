'use strict';

const herokuCluster = require('@quarterto/heroku-cluster');
const app = require('./lib');

herokuCluster({
	defaultPort: 5000,
	app,
});
