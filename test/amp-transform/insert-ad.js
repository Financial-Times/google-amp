'use strict';

const {expect} = require('../utils/chai');
const insertAd = require('../../server/lib/transforms/html/insert-ad');
const cheerio = require('cheerio');

describe('insert ad transform', () => {
	context('if user has given consent', () => {
		it('should add an ad after the 3rd paragraph', () => {
			const $ = cheerio.load(
				'<p>First paragraph</p>'
				+ '<p>Second paragraph</p>'
				+ '<p>Third paragraph</p>'
				+ '<p>Fourth paragraph</p>'
			);
			const adMarkup = '<div class="ad-container"><amp-ad width="300"	height="250" type="doubleclick" data-slot="/5887/ft.com/distributed.content/amp.ft" json="{&quot;targeting&quot;:{&quot;pos&quot;:&quot;mid&quot;}}" rtc-config=\'{"urls":["https://ads-api.ft.com/v1/content/1234?amp=true","https://ads-api.ft.com/v1/user?amp=true", "https://cdn.krxd.net/userdata/v2/amp/HINzStCn?segments_key=ksg&kuid_key=kuid"]}\'></amp-ad></div>';
			const htmlWithAd = insertAd($, {enableAds: true, uuid: 1234, ftConsentCookie: 'behaviouraladsOnsite:on'}, 'mid');
			const expectedAdSlot = htmlWithAd('p')[2].next;
			expect(expectedAdSlot).dom.to.equal(adMarkup);
		});
	});
	context('if user has NOT given consent', () => {
		it('should add an ad after the 3rd paragraph', () => {
			const $ = cheerio.load(
				'<p>First paragraph</p>'
				+ '<p>Second paragraph</p>'
				+ '<p>Third paragraph</p>'
				+ '<p>Fourth paragraph</p>'
			);
			const adMarkup = '<div class="ad-container"><amp-ad width="300"	height="250" type="doubleclick" data-slot="/5887/ft.com/distributed.content/amp.ft" json="{&quot;targeting&quot;:{&quot;pos&quot;:&quot;mid&quot;}}" rtc-config=\'{"urls":["https://ads-api.ft.com/v1/content/1234?amp=true","https://ads-api.ft.com/v1/user?amp=true"]}\'></amp-ad></div>';
			const htmlWithAd = insertAd($, {enableAds: true, uuid: 1234}, 'mid');
			const expectedAdSlot = htmlWithAd('p')[2].next;
			expect(expectedAdSlot).dom.to.equal(adMarkup);
		});
	});
	context('there are not paragraphs in the content', () => {
		it('should not bother adding an advert', () => {
			const $ = cheerio.load('<blockquote>First quote</blockquote>');
			const html = insertAd($, {enableAds: true, uuid: 1234});
			const adSlot = html('amp-ad');
			expect(adSlot.length).to.equal(0);
		});
	});
});
