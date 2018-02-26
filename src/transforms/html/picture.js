'use strict';

const {Component} = require('preact');

module.exports = class Picture extends Component {
	static selector = 'picture';

	static preprocess({match}) {
		const fallback = match('img')[0];
		return {fallback};
	}

	render({fallback}) {
		return fallback || null;
	}
};
