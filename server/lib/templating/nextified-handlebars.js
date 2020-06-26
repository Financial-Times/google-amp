'use strict';

const path = require('path');
const expressHandlebars = require('express-handlebars');
const handlebars = require('handlebars');
const loadPartials = require('./load-partials');

const nextifyHandlebars = function (options) {
	if (!options || !options.directory) {
		throw 'nextifyHandlebars requires an options object containing a directory property';
	}
	const helpers = {
		concat: function () {
			return Array.prototype.slice.call(arguments, 0, -1).join('');
		}
	};

	handlebars.registerHelper({ helpers });
	const expressHandlebarsInstance = new expressHandlebars.create({ // eslint-disable-line
		// use a handlebars instance we have direct access to so we can expose partials
		handlebars: handlebars,
		extname: options.extname || '.html',
		helpers: helpers,
		defaultLayout: options.defaultLayout || false,
		layoutsDir: options.layoutsDir || undefined
	});

	const partialsDir = (options.partialsDir || []);
	const dependencyRoot = path.join(options.directory, '/bower_components/');
	const ignoreListInLinkedDeps = ['.git', 'node_modules', 'bower_components', 'demos'];
	const limitToComponents = (options.limitToComponents || '');

	// look up templates on our own to avoid scanning thousands of files
	return loadPartials(expressHandlebarsInstance, dependencyRoot, partialsDir, ignoreListInLinkedDeps, limitToComponents)
		.then(function (partials) {
			expressHandlebarsInstance.partialsDir = partials;

			// makes the usePartial helper possible
			return expressHandlebarsInstance.getPartials()
				.then(function (partials) {
					handlebars.partials = partials;

					return expressHandlebarsInstance;
				});
		});
};

const applyToExpress = function (app, options) {
	if (!app) {
		throw 'applyToExpress requires an instance of an express app';
	}

	return nextifyHandlebars(options)
		.then(function (expressHandlebarsInstance) {
			app.set('views', options.directory + (options.viewsDirectory || '/views'));

			app.engine((options.extname || '.html'), expressHandlebarsInstance.engine);

			app.set('view engine', (options.extname || '.html'));

			return expressHandlebarsInstance;
		});
};

module.exports = applyToExpress;
module.exports.standalone = nextifyHandlebars;
