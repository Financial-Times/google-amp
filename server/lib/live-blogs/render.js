'use strict';

const collateMessages = require('./collate-messages');

const renderMessage = ({data}) => `<div
id="${data.mid}"
data-sort-time="${data.emb}"
class="live-blog--message"
${data.deleted ? 'data-tombstone' : ''}>
<span class="live-blog--author live-blog--author-colour-${((data.authorcolour - 1) % 3) + 1}">
	${data.authornamestyle === 'initials' ? data.author : data.authordisplayname}
</span>

<p>${data.textrendered}</p>
</div>`;

module.exports = (article, {catchup, meta}, options) => {
	const messages = collateMessages(catchup);
	article.isLiveBlog = true;
	article.bodyXML = `<amp-live-list
		id="live-blog-${article.id}"
		data-max-items-per-page="2000"
		${meta.status === 'closed' ? 'disabled' : ''}>
		<button update>Update</button>
		<div items>
			${messages.map(renderMessage).join('\n')}
		</div>
	</amp-live-list>`;
	return article;
};
