'use strict';

const nHandlebars = require('@financial-times/n-handlebars');

const options = {
	directory: process.cwd(),
	layoutsDir: 'views/layouts',
	partialsDir: 'views/partials',
};

exports.express = app => nHandlebars(app, options);
exports.standalone = () => nHandlebars.standalone(options);
