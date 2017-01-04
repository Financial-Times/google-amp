'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../server/lib/transform-body');
const getArticle = require('../../server/lib/get-article');

const {html: htmlBeautify} = require('js-beautify');

const testUUIDs = [
	'94e97eee-ce9a-11e5-831d-09f7778e7377'
];

describe('page transforms', () => {
	testUUIDs.forEach(uuid => {
		it(`should transform ${uuid} bodyXML and bodyHTML to same DOM`, async () => {
			const {bodyXML, bodyHTML} = (await getArticle(uuid))._source;

			expect(
				htmlBeautify(await transformBody(bodyXML))
			).to.equal(
				htmlBeautify(await transformBody(bodyHTML))
			);
		});
	});
});