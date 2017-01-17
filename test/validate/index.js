'use strict';

const {expect, assert} = require('../utils/chai');
const testUUIDs = require('../utils/test-uuids');

const ampValidator = require('amphtml-validator');
const {getAndRender} = require('../../server/controllers/amp-page');

describe('amp validator', function() {
	this.timeout(10000);
	let validator;

	before(async () => {
		validator = await ampValidator.getInstance();
	});

	testUUIDs.forEach(uuid => it(`should pass for uuid ${uuid}`, async () => {
		const article = await getAndRender(uuid, {
			production: false,
			showEverything: true,
			relatedArticleDeduper: [uuid],
		});

		const {status, errors} = validator.validateString(article);

		errors.forEach(error => {
			assert(error.severity !== 'ERROR', `${error.message} (${error.line}:${error.col}) ${error.specUrl || ''}`);
		});

		expect(status).to.equal('PASS');
	}));
});
