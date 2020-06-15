'use strict';

const promisify = require('@quarterto/promisify');
const Path = require('path');
const nextifiedHandlebars = require('./nextified-handlebars');

const options = {
	directory: process.cwd(),
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials',
};

exports.express = app => nextifiedHandlebars(app, options);
exports.standalone = () => nextifiedHandlebars.standalone(options).then(
	hbs => {
		const renderView = promisify(hbs.renderView.bind(hbs));

		return Object.assign(hbs, {
			renderView: (view, ...args) => renderView(
				Path.resolve(options.directory, 'views', `${view}.html`),
				...args
			),
		});
	}
);
