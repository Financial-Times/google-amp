'use strict';

const minBy = require('lodash.minby');

const getScore = ({idealPosition, minPosition}) => (paragraph, index) => {
	if(index < minPosition) {
		// don't place here if we're before the min position
		return Infinity;
	}

	if(!paragraph.next().is('p')) {
		// don't place here if the next element isn't a paragraph
		return Infinity;
	}

	// place as close to the ideal position as possible
	return Math.abs(index - idealPosition);
};

const scoreParagraph = (fn, $) => (index, paragraph) => ({score: fn($(paragraph), index), index});

module.exports = function getViableParagraph($, {getIdeal = () => 2, minPosition = 2} = {}) {
	const paras = $.root().children('p');
	const idealPosition = getIdeal(paras.length);

	const scores = paras.map(scoreParagraph(
		getScore({idealPosition, minPosition}), $
	)).toArray();

	const para = minBy(scores, ({score}) => score);

	if(para && para.index) {
		return paras.eq(para.index);
	}

	return null;
};
