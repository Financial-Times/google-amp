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
		priceCopy: 'Pay based on use',
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

	it('should return correct formatted secondary pricing', () => {
		expect(formatted.secondaryPricing).to.equal('Test price 6 per month');
	});

	it('should return correct formatted pricingCopy from template', () => {
		expect(formatted.pricingCopy).to.equal('Test trial 2 price monthly');
	});

	it('should return correct formatted pricingCopy', () => {
		delete mockedItem.pricingCopyPricePath;
		delete mockedItem.pricingCopyTemplate;

		formatted = formatBarrierData(mockedItem);
		expect(formatted.pricingCopy).to.equal(mockedItem.pricingCopy);
	});

	it('ishould return normal price if the priceValue pricingCopyPricePath is missing', () => {
		mockedItem.pricingCopyPricePath = 'missing.pricing.value';
		formatted = formatBarrierData(mockedItem);
		expect(formatted.pricingCopy).to.equal(mockedItem.pricingCopy);
	});
});
