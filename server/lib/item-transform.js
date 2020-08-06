const get = require('lodash.get');

const PRICE_MATCH = '[PRICE]';

module.exports.itemTransform = item => {
	item.formatted = {};

	if (item.secondaryPricing && item.secondaryPricing.length > 0) {
		const { copyPricePath, copyTemplate } = item.secondaryPricing[0];
		const secondaryPriceValue = get(item, copyPricePath);

		item.formatted.secondaryPricing = copyTemplate.replace(PRICE_MATCH, secondaryPriceValue);
		delete item.secondaryPricing;
	}

	if (item.pricingCopyPricePath && item.pricingCopyTemplate) {
		const pricingValue = get(item, item.pricingCopyPricePath);
		item.formatted.pricingCopy = item.pricingCopyTemplate.replace(PRICE_MATCH, pricingValue);

		delete item.pricingCopyPricePath;
		delete item.pricingCopyTemplate;
	} else {
		item.formatted.pricingCopy = item.pricingCopy;
	}

	delete item.pricingCopy;

	if (item.promoPricingCopyTemplate && item.promoPricingCopyPricePath) {
		const promoPricingValue = get(item, item.promoPricingCopyPricePath);
		item.formatted.promoPricingCopy = item.promoPricingCopyTemplate.replace(PRICE_MATCH, promoPricingValue);

		delete item.promoPricingCopyTemplate;
		delete item.promoPricingCopyPricePath;
	}

	return item;
};
