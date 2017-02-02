'use strict';

const {expect} = require('../utils/chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const cheerio = require('cheerio');

const getArticleStub = sinon.stub();

const {getAndRender} = proxyquire('../../server/controllers/amp-page', {
	'../lib/article/get-article': getArticleStub,
});

const fixture = require('../fixtures/72402230-e6db-11e6-967b-c88452263daf.json');

describe('ads', () => {
	it('should be inserted if enableAds is set in controller', async () => {
		getArticleStub.withArgs('72402230-e6db-11e6-967b-c88452263daf').returns(Promise.resolve(fixture));

		const content = await getAndRender('72402230-e6db-11e6-967b-c88452263daf', {enableAds: true});
		const $ = cheerio.load(content);
		expect($('amp-ad')).to.have.length.above(0);
	});
});
