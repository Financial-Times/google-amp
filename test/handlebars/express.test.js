/*global it, describe, before*/
'use strict';

const request = require('supertest');
const app = require('../fixtures/app/main');

describe('express handlebars setup', function () {
	before(function () {
		return app.promise;
	});

	it('should do templating', function (done) {
		request(app)
			.get('/templated')
			.expect(200, /FT/, done);
	});

	it('should not inherit any markup by default', function (done) {
		request(app)
			.get('/templated')
			.expect(200, /^<h1>FT - on/, done);
	});

	it('should support loading partials via bower', function (done) {
		request(app)
			.get('/templated')
			.expect(200, /End of dep 2 partial/, done);
	});

	it('should treat undefined flags as offy (like falsey)', function (done) {
		request(app)
			.get('/templated')
			.expect(200, /<undefinedflag-on><\/undefinedflag-on>/, done);
	});

	describe('content helpers', function () {
		it('should provide a string concatenation helper', function (done) {
			request(app)
				.get('/templated')
				.expect(200, /Concat onetwothree/, done);
		});
	});


});
