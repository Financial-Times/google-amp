'use strict';

const {XmlEntities: Entities} = require('html-entities');
const collateMessages = require('./collate-messages');
const dateTransform = require('../article-date');

const entities = new Entities();

// https://jira.ft.com/browse/AT-722
const rewriteAlphavilleURL = text => text.replace(/(https?:\/\/)ftalphaville.ft.com/g, '$1ftalphaville-wp.ft.com');

const renderMessage = (data) => `<div
id="live-blog-message-${data.mid}"
data-sort-time="${data.emb}"
data-update-time="${data.datemodified}"
class="live-blog--message"
${data.deleted ? 'data-tombstone' : ''}>
${dateTransform(data.emb * 1000, {classname: 'live-blog--time', format: 'datetimeortime'})}
<span class="live-blog--author live-blog--author-colour-${((data.authorcolour - 1) % 3) + 1}">
	${data.authornamestyle === 'initials' ? data.author : data.authordisplayname}
</span>

<p>${rewriteAlphavilleURL(data.textrendered)}</p>
</div>`;

module.exports = (article, {catchup, meta, config}, options) => {
	const {messages, postUpdated} = collateMessages(catchup, Object.assign({}, options, config));

	if(postUpdated) {
		article.title = entities.decode(postUpdated.data.title);
		article.liveBlogsExcerpt = entities.decode(postUpdated.data.excerpt);
	}

	article.liveBlogStatus = meta.status;
	article.liveBlogStatusLabel = ({
		inprogress: 'Live',
		closed: 'Archived',
		pending: 'Pending',
		comingsoon: 'Coming soon',
	})[meta.status];

	article.isLiveBlog = true;
	article.bodyXML = `<amp-live-list
		class="live-blog"
		id="live-blog-${article.id}"
		data-max-items-per-page="2000"
		${meta.status === 'closed' ? 'disabled' : ''}>
		<div class="live-blog--update-banner" update>
			<button class="live-blog--update-button" on="tap:live-blog-${article.id}.update" data-vars-link-type="live-blog-load-new-posts" data-vars-link-text="New posts">New posts</button>
		</div>
		<div items>
			${messages.map(renderMessage).join('\n')}
		</div>
	</amp-live-list>`;

	return article;
};
