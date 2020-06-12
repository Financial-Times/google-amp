'use strict';

const promisify = require('@quarterto/promisify');
const Path = require('path');
const handlebarsUtil = require('./handlebars-util');

const options = {
	directory: process.cwd(),
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials',
};

exports.standalone = () => handlebarsUtil.nextifyHandlebars(options).then(
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

exports.express = app => handlebarsUtil.applyToExpress(app, options);