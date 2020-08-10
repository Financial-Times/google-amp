const {itemTransform} = require('../../server/lib/item-transform');
const {expect} = require('../utils/chai');


const PRICE_MATCH = '[PRICE]';
const EMPTY_ITEM = {};

describe('item-transform', () => {
	let mockedItem;

	beforeEach(() => {
		mockedItem = mockItem();
	});

	it('should return correct formatted secondary pricing', () => {

		expect(itemTransform(mockedItem).formatted.secondaryPricing).to.equal('Test price 6 per month');
		expect(mockedItem.secondaryPricing).to.equal(undefined);
	});

	it('should not include formatted secondary pricing as a field', () => {
		expect(itemTransform(EMPTY_ITEM).formatted.secondaryPricing).to.equal(undefined);
	});

	it('should return correct formatted pricingCopy from template', () => {

		expect(itemTransform(mockedItem).formatted.pricingCopy).to.equal('Test trial 2 price monthly');
		expect(mockedItem.pricingCopyPricePath).to.equal(undefined);
		expect(mockedItem.pricingCopyTemplate).to.equal(undefined);
	});

	it('should return correct formatted pricingCopy', () => {
		delete mockedItem.pricingCopyPricePath;
		delete mockedItem.pricingCopyTemplate;

		expect('TestpriceCopy', itemTransform(mockedItem).formatted.pricingCopy);
		expect(mockedItem.pricingCopy).to.equal(undefined);
	});

	it('should not include formatted pricing copy as a field', () => {
		expect(itemTransform(EMPTY_ITEM).formatted.pricingCopy).to.equal(undefined);
	});

	it('should return correct formatted promo pricingCopy', () => {

		expect(itemTransform(mockedItem).formatted.promoPricingCopy).to.equal('Test promo 150 price per year');
		expect(mockedItem.promoPricingCopyPricePath).to.equal(undefined);
		expect(mockedItem.promoPricingCopyTemplate).to.equal(undefined);
	});

	it('should not include formatted promo pricing copy as a field', () => {
		expect(itemTransform(EMPTY_ITEM).formatted.promoPricingCopy).to.equal(undefined);
	});

});

const mockItem = () => {
	return {
		secondaryPricing: [
			{
				copyTemplate:
				'Test price ' + PRICE_MATCH + ' per month',
				copyPricePath: 'pricing.billedMonthly.monthly.amount.value',
			},
		],
		priceCopy: 'Pay based on use',
		pricingCopyPricePath: 'pricing.billedMonthly.trial.amount',
		pricingCopyTemplate: 'Test trial ' + PRICE_MATCH + ' price monthly',
		promoPricingCopyTemplate: 'Test promo ' + PRICE_MATCH + ' price per year',
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
	}
};
