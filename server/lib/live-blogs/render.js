'use strict';

const renderMessage = ({data}) => `<div id="${data.mid}" data-sort-time="${data.emb}">
<span class="article-author-byline__author">
	${data.authornamestyle === 'initials' ? data.author : data.authordisplayname}
</span>

<p>${data.textrendered}</p>
</div>`;

module.exports = (article, catchup, options) => {
	const messages = catchup.filter(({event}) => event === 'msg');
	article.isLiveBlog = true;
	article.bodyXML = `<amp-live-list id="${article.id}" data-max-items-per-page="2000">
		<button update>Update</button>
		<div items>
			${messages.map(renderMessage).join('\n')}
		</div>
	</amp-live-list>`;
	return article;
};
