'use strict';

const nHandlebars = require('@financial-times/n-handlebars');
const promisify = require('@quarterto/promisify');
const path = require('path');

const options = {
	directory: process.cwd(),
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials',
};

exports.express = app => nHandlebars(app, options);
exports.standalone = () => nHandlebars.standalone(options).then(
	hbs => {
		const renderView = promisify(hbs.renderView.bind(hbs));

		return Object.assign(hbs, {
			renderView: (view, ...args) => renderView(
				path.resolve(options.directory, 'views', `${view}.html`),
				...args
			),
		});
	}
);
