'use strict';

const minBy = require('lodash.minby');
const {selectAll} =  require('css-select');

const nextEl = el => el.next && el.next.type !== 'tag'
	? nextEl(el.next)
	: el.next;

module.exports = function getViableParagraph(el, {getIdeal = () => 2, minPosition = 2} = {}) {
	const paras = selectAll(':root > p', el);
	const idealPosition = getIdeal(paras.length);

	const score = (paragraph, index) => {
		if(index < minPosition) {
			// don't place here if we're before the min position
			return Infinity;
		}

		const next = nextEl(paragraph);

		if(next && next.name !== 'p') {
			// don't place here if the next element isn't a paragraph
			return Infinity;
		}

		// place as close to the ideal position as possible
		return Math.abs(index - idealPosition);
	};

	const scores = paras.map((paragraph, index) => ({
		score: score(paragraph, index),
		index,
	}));

	return paras[minBy(scores, ({score}) => score).index];
};
