'use strict';

var _class, _temp;

const { h, Component } = require('preact');

module.exports = (_temp = _class = class Picture extends Component {

	static preprocess({ match }) {
		const fallback = match('img')[0];
		return { fallback };
	}

	render({ fallback }) {
		return fallback || null;
	}
}, _class.selector = 'picture', _temp);
