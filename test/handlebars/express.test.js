'use strict';

const request = require('supertest');
const app = require('../utils/hbs-app/main');

describe('express handlebars setup', function () {
	before(function () {
		return app.promise;
	});

	it('should do templating', async function () {
		await request(app)
			.get('/templated')
			.expect(200, /FT/);
	});

	it('should not inherit any markup by default', async function () {
		await request(app)
			.get('/templated')
			.expect(200, /^<h1>FT - on/);
	});

	it('should support loading partials via bower', async function () {
		await request(app)
			.get('/templated')
			.expect(200, /End of dep 2 partial/);
	});

	it('should treat undefined flags as offy (like falsey)', async function () {
		await request(app)
			.get('/templated')
			.expect(200, /<undefinedflag-on><\/undefinedflag-on>/ );
	});

	describe('content helpers', async function () {
		it('should provide a string concatenation helper', async function () {
			await request(app)
				.get('/templated')
				.expect(200, /Concat onetwothree/);
		});
	});


});
