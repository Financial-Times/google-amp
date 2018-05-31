'use strict';

const herokuCluster = require('@quarterto/heroku-cluster');
const https = require('https');
const denodeify = require('denodeify');
const path = require('path');
const fs = require('fs');
const app = require('./server');

const isDevelopment = app.get('env') === 'development';

if(isDevelopment) {
	const readFile = denodeify(fs.readFile);
	const keyFile = readFile(path.resolve(__dirname, 'key.pem'));
	const certFile = readFile(path.resolve(__dirname, 'cert.pem'));
	Promise.all([keyFile, certFile])
		.then(([key, cert]) => {
			https.createServer({ key, cert }, app)
				.listen(5050, () => console.log('App listening on port 5050 (https) in development'));
		}).catch(err => {
			console.error('Couldn\'t start https. Please make sure you have `cert.pem` and `key.pem` files locally.');
		});
	app.listen(5000, () => console.log('App listening on port 5000 (http) in development'));
} else {
	herokuCluster({
		defaultPort: 5000,
		app,
	});
}
