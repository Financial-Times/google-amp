'use strict';

const {expect} = require('../utils/chai');
const proxyquire = require('proxyquire').noPreserveCache();
const sinon = require('sinon');
const cheerio = require('cheerio');

const getArticleStub = sinon.stub();

const {render} = proxyquire('../../server/lib/article/assemble', {
	'./get-article': getArticleStub,
});

const fixture = require('../fixtures/ca04513c-e9c7-11e6-893c-082c54a7f539.json');

describe('brightcove', () => {
	it('should use account and player id from environment', async () => {
		getArticleStub.withArgs('ca04513c-e9c7-11e6-893c-082c54a7f539').returns(Promise.resolve(fixture));
		const content = await render('ca04513c-e9c7-11e6-893c-082c54a7f539', {
			brightcoveAccountId: 'account-id',
			brightcovePlayerId: 'player-id',
			relatedArticleDeduper: [],
		});

		const $ = cheerio.load(content);

		expect($('amp-brightcove').attr('data-account')).to.equal('account-id');
		expect($('amp-brightcove').attr('data-player')).to.equal('player-id');
	});
});
