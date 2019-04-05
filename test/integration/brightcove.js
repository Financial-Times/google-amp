'use strict';

const nEsClient = require('@financial-times/n-es-client');
const sinon = require('sinon');
const cheerio = require('cheerio');
const {render} = require('../../server/lib/article/assemble');
const {expect} = require('../utils/chai');


const fixture = require('../fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json');

describe('brightcove', () => {
	before(() => {
		sinon.stub(nEsClient, 'get');
	});

	afterEach(() => {
		nEsClient.get.reset();
	});

	after(() => {
		nEsClient.get.restore();
	});

	it('should use account and player id from environment', async() => {
		nEsClient.get.withArgs('ca04513c-e9c7-11e6-893c-082c54a7f539').returns(Promise.resolve(fixture));
		const content = await render('ca04513c-e9c7-11e6-893c-082c54a7f539', {
			brightcoveAccountId: 'account-id',
			brightcovePlayerId: 'player-id',
			relatedArticleDeduper: [],
			unfurlBrightcove: false,
		});

		const $ = cheerio.load(content);

		expect($('amp-brightcove').attr('data-account')).to.equal('account-id');
		expect($('amp-brightcove').attr('data-player')).to.equal('player-id');
	});
});
