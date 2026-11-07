import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateBookingQuote, formatCurrency, validatePromoCode } from './pricing';

test('calculateBookingQuote calculates standard base fee without extras', () => {
  const quote = calculateBookingQuote({
    baseServiceFee: 100,
    isUrgent: false,
    estimatedMaterialCost: 0,
  });

  // Base 100, no urgency, no material => subtotal 100
  // Taxable 100, 15% VAT = 15 => total 115
  assert.equal(quote.baseServiceFee, 100);
  assert.equal(quote.urgencySurcharge, 0);
  assert.equal(quote.materialCost, 0);
  assert.equal(quote.subtotal, 100);
  assert.equal(quote.vatAmount, 15);
  assert.equal(quote.total, 115);
});

test('calculateBookingQuote applies urgent express surcharge correctly (35%)', () => {
  const quote = calculateBookingQuote({
    baseServiceFee: 200,
    isUrgent: true,
  });

  // Base 200, urgent +35% = 70 => subtotal 270
  // VAT 15% of 270 = 40.5 => total 310.5
  assert.equal(quote.urgencySurcharge, 70);
  assert.equal(quote.subtotal, 270);
  assert.equal(quote.vatAmount, 40.5);
  assert.equal(quote.total, 310.5);
});

test('calculateBookingQuote applies promo code discount HIRAFI20', () => {
  const quote = calculateBookingQuote({
    baseServiceFee: 100,
    discountCode: 'hirafi20',
  });

  // Subtotal 100, 20% discount = 20 => taxable 80
  // VAT 15% of 80 = 12 => total 92
  assert.equal(quote.discountAmount, 20);
  assert.equal(quote.vatAmount, 12);
  assert.equal(quote.total, 92);
  assert.equal(quote.appliedDiscountName, '20% off Hirafi Special');
});

test('formatCurrency formats properly for Arabic and English', () => {
  assert.equal(formatCurrency(150, 'ar', 'SAR'), '150 ر.س');
  assert.equal(formatCurrency(150, 'en', 'SAR'), 'SAR 150');
  assert.equal(formatCurrency(50, 'en', 'USD'), '$ 50');
});

test('validatePromoCode returns valid for known codes and invalid for unknown', () => {
  assert.equal(validatePromoCode('HIRAFI20').valid, true);
  assert.equal(validatePromoCode('INVALID99').valid, false);
});
