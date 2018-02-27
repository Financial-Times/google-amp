'use strict';

const {expect} = require('../utils/chai');
const transformBody = require('../../lib/transforms/body');
const sinon = require('sinon');

const stubRaven = sinon.stub({
	captureException() {},
});

describe('amp links transform', () => {
	it('should add ft.com to /content links and add tracking attributes', async () => {
		expect(
			await transformBody('<a href="/content/uuid">link</a>')
		).dom.to.equal('<a href="https://www.ft.com/content/uuid" data-vars-link-destination="https://www.ft.com/content/uuid" data-vars-link-type="inline" data-vars-link-text="link">link</a>');
	});

	describe('invalid links', () => {
		it('should replace links with invalid hrefs with their content', async () => {
			// nb these are all actual examples of invalid links from articles
			await Promise.all([
				{
					href: '(https://www.cornyn.senate.gov/sites/default/files/Oracle%20FIRRMA%20Letter.pdf',
					error: 'Invalid link protocol',
				},
				{
					href: '../category/middle-east/bahrain/',
					error: 'Invalid link protocol',
				},
				{
					href: '/Tom.Mitchell@ft.com',
					error: 'Invalid link protocol',
				},
				{
					href: 'In%20depth:London%20Fashion%20Week',
					error: 'Invalid link protocol',
				},
				{
					href: '',
					error: 'Link with empty href',
				},
			].map(async ({href, error}) => {
				expect(
					await transformBody(
						`<a href="${href}">link</a>`,
						{raven: stubRaven}
					)
				).dom.to.equal('link');

				expect(
					stubRaven.captureException
				).to.have.been.calledWithMatch(
					sinon.match.has('message', error)
				);
			}));
		});
	});
});
