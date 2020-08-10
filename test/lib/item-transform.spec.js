const itTrMod = require('../../server/lib/item-transform');
const {expect} = require('../utils/chai');


const PRICE_MATCH = '[PRICE]';
const EMPTY_ITEM = {};
const ACTUAL_SECONDARY_PRICE_TEXT = 'Test price 6 per month';
const ACTUAL_COPY_PRICE_TEXT = 'Test trial 2 price monthly';
const ACTUAL_PROMO_PRICE_TEXT = 'Test promo 150 price per year';
const ACTUAL_PRICE_TEXT = 'Pay based on use';
describe('item-transform', () => {
	let MOCKED_ITEM;

	beforeEach(() => {
		MOCKED_ITEM = {
			secondaryPricing: [
			{
				copyTemplate:
					'Test price '+ PRICE_MATCH + ' per month',
				copyPricePath: 'pricing.billedMonthly.monthly.amount.value',
			},
			],
			priceCopy: ACTUAL_PRICE_TEXT,
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
	});

	it('should return correct formatted secondary pricing', () => {

		expect(itTrMod.itemTransform(MOCKED_ITEM).formatted.secondaryPricing).to.equal(ACTUAL_SECONDARY_PRICE_TEXT);
		expect(MOCKED_ITEM.secondaryPricing).to.equal(undefined);
	});

	it('should not include formatted secondary pricing as a field', () => {
		expect(itTrMod.itemTransform(EMPTY_ITEM).formatted.secondaryPricing).to.equal(undefined);
	});

	it('should return correct formatted pricingCopy from template', () => {

		expect(itTrMod.itemTransform(MOCKED_ITEM).formatted.pricingCopy).to.equal(ACTUAL_COPY_PRICE_TEXT);
		expect(MOCKED_ITEM.pricingCopyPricePath).to.equal(undefined);
		expect(MOCKED_ITEM.pricingCopyTemplate).to.equal(undefined);
	});

	it('should return correct formatted pricingCopy', () => {
		MOCKED_ITEM.pricingCopyPricePath = undefined;
		MOCKED_ITEM.pricingCopyTemplate = undefined;

		expect('TestpriceCopy', itTrMod.itemTransform(MOCKED_ITEM).formatted.pricingCopy);
		expect(MOCKED_ITEM.pricingCopy).to.equal(undefined);
	});

	it('should not include formatted pricing copy as a field', () => {
		expect(itTrMod.itemTransform(EMPTY_ITEM).formatted.pricingCopy).to.equal(undefined);
	});

	it('should return correct formatted promo pricingCopy', () => {

		expect(itTrMod.itemTransform(MOCKED_ITEM).formatted.promoPricingCopy).to.equal(ACTUAL_PROMO_PRICE_TEXT);
		expect(MOCKED_ITEM.promoPricingCopyPricePath).to.equal(undefined);
		expect(MOCKED_ITEM.promoPricingCopyTemplate).to.equal(undefined);
	});

	it('should not include formatted promo pricing copy as a field', () => {
		expect(itTrMod.itemTransform(EMPTY_ITEM).formatted.promoPricingCopy).to.equal(undefined);
	});

});
