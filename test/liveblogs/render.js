'use strict';

const {expect} = require('../utils/chai');
const renderLiveBlog = require('../../lib/live-blogs/render');
const oDate = require('o-date');

describe('render', () => {
	it('should add status keys to result', () => {
		const rendered = renderLiveBlog({}, {meta: {status: 'inprogress'}, catchup: [], config: {}}, {});
		expect(rendered).to.have.property('liveBlogStatus', 'inprogress');
		expect(rendered).to.have.property('liveBlogStatusLabel', 'Live');
	});

	it('should render basic messages', () => {
		const timestamp = Math.floor(Date.now() / 1000);
		const now = new Date(timestamp * 1000);

		const rendered = renderLiveBlog({id: 'ffffffff-ffff-ffff-ffff-fffffffffff'}, {
			meta: {},
			catchup: [{
				event: 'msg',
				data: {
					mid: 12345678,
					textrendered: 'hello',
					emb: timestamp,
					datemodified: timestamp,
					authorcolour: 1,
					authordisplayname: 'Matt',
				},
			}],
			config: {},
		}, {});

		expect(rendered.bodyHTML).dom.to.equal(`<amp-live-list
			class="live-blog"
			id="live-blog-ffffffff-ffff-ffff-ffff-fffffffffff"
			data-max-items-per-page="2000">
			<div class="live-blog--update-banner" update>
				<button
					class="live-blog--update-button"
					on="tap:live-blog-ffffffff-ffff-ffff-ffff-fffffffffff.update"
					data-vars-link-type="live-blog-load-new-posts"
					data-vars-link-text="New posts">New posts</button>
			</div>
			<div items>
				<div
					id="live-blog-message-12345678"
					data-sort-time="${timestamp}"
					data-update-time="${timestamp}"
					class="live-blog--message">
					<time class="live-blog--time" itemprop="datePublished" datetime="${now.toISOString()}">
						${oDate.format(now, 'HH:mm a')}
					</time>
					<span class="live-blog--author live-blog--author-colour-1">
						Matt
					</span>

					<p>hello</p>
					</div>
			</div>`);
	});
});
