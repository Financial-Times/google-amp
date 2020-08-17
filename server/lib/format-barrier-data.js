const get = require('lodash.get');

const PRICE_MATCH = '[PRICE]';

module.exports.formatBarrierData = offer => {
	const formatted = {};

	if (offer.secondaryPricing && offer.secondaryPricing.length > 0) {
		const { copyPricePath, copyTemplate } = offer.secondaryPricing[0];
		const secondaryPriceValue = get(offer, copyPricePath);

		formatted.secondaryPricing = copyTemplate.replace(PRICE_MATCH, secondaryPriceValue);
	}

	const pricingValue = get(offer, offer.pricingCopyPricePath);
	if (pricingValue && offer.pricingCopyTemplate) {
		formatted.pricingCopy = offer.pricingCopyTemplate.replace(PRICE_MATCH, pricingValue);
	} else {
		formatted.pricingCopy = offer.pricingCopy;
	}

	if (offer.promoPricingCopyTemplate && offer.promoPricingCopyPricePath) {
		const promoPricingValue = get(offer, offer.promoPricingCopyPricePath);
		formatted.promoPricingCopy = offer.promoPricingCopyTemplate.replace(PRICE_MATCH, promoPricingValue);
	}

	return formatted;
};
