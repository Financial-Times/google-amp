'use strict';

const collateMessages = require('./collate-messages');

const renderMessage = (data) => `<div
id="live-blog-message-${data.mid}"
data-sort-time="${data.emb}"
class="live-blog--message"
${data.deleted ? 'data-tombstone' : ''}>
<span class="live-blog--author live-blog--author-colour-${((data.authorcolour - 1) % 3) + 1}">
	${data.authornamestyle === 'initials' ? data.author : data.authordisplayname}
</span>

<p>${data.textrendered}</p>
</div>`;

module.exports = (article, {catchup, meta, config}, options) => {
	const messages = collateMessages(catchup, config);
	article.isLiveBlog = true;
	article.bodyXML = `<amp-live-list
		id="live-blog-${article.id}"
		data-max-items-per-page="2000"
		${meta.status === 'closed' ? 'disabled' : ''}>
		<div class="live-blog--update-banner" update>
			<button class="live-blog--update-button" on="tap:live-blog-${article.id}.update">New messages</button>
		</div>
		<div items>
			${messages.map(renderMessage).join('\n')}
		</div>
	</amp-live-list>`;
	return article;
};
