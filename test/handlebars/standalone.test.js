'use strict';

const handlebars = require('../../server/lib/templating/nextified-handlebars');
const expect = require('chai').expect;
const path = require('path');

describe('standalone', function () {
	it('should render a template as a standalone instance', function (done) {

		handlebars.standalone({
			partialsDir: [
				path.resolve(__dirname, '../utils/hbs-app/views/partials')
			],
			directory: path.resolve(__dirname, '../utils/hbs-app/')
		})
			.then(function (instance) {

				return instance.render(path.resolve(__dirname, '../utils/hbs-app/views/main.html'), {title: 'FT'})
					.then(function (html) {
						expect(html).to.match(/<h1>FT[\s\S]*<h3>I am partial of dep 1[\s\S]*<h3>I am partial of dep 2[\s\S]*<p>Concat onetwothree[\s\S]*/);
						done();
					});
			})
			// eslint-disable-next-line no-console
			.catch(console.log.bind(console));
	});
});
