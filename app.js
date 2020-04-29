'use strict';

const httpolyglot = require('httpolyglot');
const path = require('path');
const fs = require('fs');
const app = require('./server');

const isDevelopment = app.get('env') === 'development';
const hasCertificate = fs.existsSync(path.resolve(__dirname, 'key.pem'))
	&& fs.existsSync(path.resolve(__dirname, 'cert.pem'));

if(isDevelopment && hasCertificate) {
	httpolyglot.createServer({
		key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
		cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
	}, app).listen(5050, () => {
		// eslint-disable-next-line no-console
		console.log('\x1b[1mExpress server HTTP *and* HTTPS listening on 5050 in development.\x1b[0m');
	});
} else {
	app.listen(process.env.PORT || 5000);
}
