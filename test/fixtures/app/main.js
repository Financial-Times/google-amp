/* eslint no-console: 0 */
/*jshint node:true*/
'use strict';

const express = require('express');
const handlebars = require('../../../server/lib/handlebars/nextified-handlebars');
const app = module.exports = express();

const handlebarsPromise = handlebars(app, {
	partialsDir: [
		__dirname + '/views/partials'
	],
	directory: __dirname
});

app.get('/templated', function (req, res) {
	res.render('main', {title: 'FT'});
});

const actualAppListen = app.listen;

app.listen = function () {
	const args = arguments;

	return handlebarsPromise.then(function () {
		console.log('app listen', actualAppListen);
		actualAppListen.apply(app, args);
	});
};

app.promise = handlebarsPromise.then(function () {
	console.log('This then is attached later than the internal then attached by our handlebars code');
});
