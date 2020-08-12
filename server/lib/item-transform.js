const get = require('lodash.get');

const PRICE_MATCH = '[PRICE]';

module.exports.itemTransform = offer => {
	offer.formatted = {};

	if (offer.secondaryPricing && offer.secondaryPricing.length > 0) {
		const { copyPricePath, copyTemplate } = offer.secondaryPricing[0];
		const secondaryPriceValue = get(offer, copyPricePath);

		offer.formatted.secondaryPricing = copyTemplate.replace(PRICE_MATCH, secondaryPriceValue);
		delete offer.secondaryPricing;
	}

	if (offer.pricingCopyPricePath && offer.pricingCopyTemplate) {
		const pricingValue = get(offer, offer.pricingCopyPricePath);
		offer.formatted.pricingCopy = offer.pricingCopyTemplate.replace(PRICE_MATCH, pricingValue);

		delete offer.pricingCopyPricePath;
		delete offer.pricingCopyTemplate;
	} else {
		offer.formatted.pricingCopy = offer.pricingCopy;
	}

	delete offer.pricingCopy;

	if (offer.promoPricingCopyTemplate && offer.promoPricingCopyPricePath) {
		const promoPricingValue = get(offer, offer.promoPricingCopyPricePath);
		offer.formatted.promoPricingCopy = offer.promoPricingCopyTemplate.replace(PRICE_MATCH, promoPricingValue);

		delete offer.promoPricingCopyTemplate;
		delete offer.promoPricingCopyPricePath;
	}

	return offer;
};
