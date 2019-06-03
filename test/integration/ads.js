'use strict';

const {expect} = require('../utils/chai');
const {render} = require('../../server/lib/article/assemble');
const nEsClient = require('@financial-times/n-es-client');
const sinon = require('sinon');

const fixture = require('../fixtures/72402230-e6db-11e6-967b-c88452263daf.json');

describe('ads', () => {
	before(() => {
		sinon.stub(nEsClient, 'get');
	});

	afterEach(() => {
		nEsClient.get.reset();
	});

	after(() => {
		nEsClient.get.restore();
	});

	it('should be inserted if enableAds is set in controller', async() => {
		nEsClient.get.withArgs('72402230-e6db-11e6-967b-c88452263daf').returns(Promise.resolve(fixture));

		expect(
			await render('72402230-e6db-11e6-967b-c88452263daf', {
				enableAds: true,
				relatedArticleDeduper: [],
			})
		).to.have.selector('amp-ad');
	});
});
