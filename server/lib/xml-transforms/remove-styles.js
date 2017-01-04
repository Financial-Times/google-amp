'use strict';

module.exports = function removeStyleAttributes($) {
	$('[style]').each(function eachStyle() {
		$(this).removeAttr('style');
	});

	return $;
};
