const {formatBarrierData} = require('../../server/lib/format-barrier-data');
const {expect} = require('../utils/chai');

const getMockedOfferItem = () => {
	return {
		secondaryPricing: [
			{
				copyTemplate: 'Test price [PRICE] per month',
				copyPricePath: 'pricing.billedMonthly.monthly.amount.value',
			},
		],
		pricingCopy: 'Pay based on use',
		pricingCopyFallback: 'Check availability',
		pricingCopyPricePath: 'pricing.billedMonthly.trial.amount',
		pricingCopyTemplate: 'Test trial [PRICE] price monthly',
		promoPricingCopyTemplate: 'Test promo [PRICE] price per year',
		promoPricingCopyPricePath: 'pricing.billedYearly.yearly.amount.value',
		pricing: {
			billedMonthly: {
				trial: {
					amount: 2
				},
				monthly: {
					amount: {
						value: 6
					}
				}
			},
			billedYearly: {
				yearly: {
					amount: {
						value: 150
					}
				}
			}
		}
	};
};

describe('formatBarrierData(offer)', () => {
	let mockedItem;
	let formatted;

	beforeEach(() => {
		mockedItem = getMockedOfferItem();
		formatted = formatBarrierData(mockedItem);
	});

	describe('when offer is empty', () => {
		let emptyFormatted;

		beforeEach(() => {
			emptyFormatted = formatBarrierData({});
		});

		it('should not include formatted secondary pricing as a field', () => {
			expect(emptyFormatted.secondaryPricing).to.equal(undefined);
		});

		it('should not include formatted pricing copy as a field', () => {
			expect(emptyFormatted.pricingCopy).to.equal(undefined);
		});

		it('should not include formatted promo pricing copy as a field', () => {
			expect(emptyFormatted.promoPricingCopy).to.equal(undefined);
		});
	});

	it('should return correctly formatted secondaryPricing', () => {
		expect(formatted.secondaryPricing).to.equal('Test price 6 per month');
	});

	it('should return correctly formatted pricingCopy', () => {
		expect(formatted.pricingCopy).to.equal('Test trial 2 price monthly');
	});

	it('should return correctly formatted promoPricingCopy', () => {
		expect(formatted.promoPricingCopy).to.equal('Test promo 150 price per year');
	});

	it('should return correctly formatted pricingCopy', () => {
		delete mockedItem.pricingCopyPricePath;
		delete mockedItem.pricingCopyTemplate;

		formatted = formatBarrierData(mockedItem);
		expect(formatted.pricingCopy).to.equal(mockedItem.pricingCopy);
	});

	it('should return correctly fallback pricing copy when main is missing', () => {
		delete mockedItem.pricingCopyPricePath;
		delete mockedItem.pricingCopy;

		formatted = formatBarrierData(mockedItem);
		expect(formatted.pricingCopy).to.equal(mockedItem.pricingCopyFallback);
	});

	it('should return normal price if the pricingCopyPricePath is missing or invalid', () => {
		mockedItem.pricingCopyPricePath = 'missing.pricing.value';
		formatted = formatBarrierData(mockedItem);
		expect(formatted.pricingCopy).to.equal(mockedItem.pricingCopy);
	});

	it('should return correctly formatted promoPricingCopy', () => {
		delete mockedItem.promoPricingCopyPricePath;
		delete mockedItem.promoPricingCopyTemplate;

		formatted = formatBarrierData(mockedItem);
		expect(formatted.hasOwnProperty('promoPricingCopy')).to.equal(false);
	});

	it('should return correctly formatted promoPricingCopy', () => {
		mockedItem.promoPricingCopyPricePath = 'invalid.promo.price';
		formatted = formatBarrierData(mockedItem);
		expect(formatted.hasOwnProperty('promoPricingCopy')).to.equal(false);
	});
});
