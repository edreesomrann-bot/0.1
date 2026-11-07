/**
 * Hirafi (حِرفي) Pricing Engine & Calculations
 * Pure calculation logic for service quotes, urgency surcharges, and discounts.
 */

export interface PricingInput {
  baseServiceFee: number;
  isUrgent?: boolean;
  estimatedMaterialCost?: number;
  discountCode?: string;
}

export interface PricingBreakdown {
  baseServiceFee: number;
  urgencySurcharge: number;
  materialCost: number;
  subtotal: number;
  discountAmount: number;
  vatAmount: number; // 15% VAT standard
  total: number;
  appliedDiscountName?: string;
}

export const VALID_PROMO_CODES: Record<string, { percent?: number; fixed?: number; name: string }> = {
  HIRAFI20: { percent: 20, name: '20% off Hirafi Special' },
  WELCOME50: { fixed: 50, name: '50 SAR Welcome Voucher' },
  FIXIT10: { percent: 10, name: '10% Handyman Discount' },
};

export const VAT_RATE = 0.15; // 15% standard VAT
export const URGENT_SURCHARGE_RATE = 0.35; // 35% express emergency surcharge

export function calculateBookingQuote(input: PricingInput): PricingBreakdown {
  const baseServiceFee = Math.max(0, input.baseServiceFee);
  const urgencySurcharge = input.isUrgent ? Math.round(baseServiceFee * URGENT_SURCHARGE_RATE) : 0;
  const materialCost = Math.max(0, input.estimatedMaterialCost || 0);

  const subtotal = baseServiceFee + urgencySurcharge + materialCost;

  let discountAmount = 0;
  let appliedDiscountName: string | undefined = undefined;

  if (input.discountCode) {
    const code = input.discountCode.trim().toUpperCase();
    const promo = VALID_PROMO_CODES[code];
    if (promo) {
      if (promo.percent) {
        discountAmount = Math.round(subtotal * (promo.percent / 100));
      } else if (promo.fixed) {
        discountAmount = Math.min(subtotal, promo.fixed);
      }
      appliedDiscountName = promo.name;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const vatAmount = Math.round(taxableAmount * VAT_RATE * 100) / 100;
  const total = Math.round((taxableAmount + vatAmount) * 100) / 100;

  return {
    baseServiceFee,
    urgencySurcharge,
    materialCost,
    subtotal,
    discountAmount,
    vatAmount,
    total,
    appliedDiscountName,
  };
}

export function formatCurrency(amount: number, locale: 'ar' | 'en' = 'ar', currency: 'SAR' | 'USD' = 'SAR'): string {
  const rounded = Number(amount).toFixed(0);
  if (locale === 'ar') {
    return `${rounded} ${currency === 'SAR' ? 'ر.س' : '$'}`;
  }
  return `${currency === 'SAR' ? 'SAR' : '$'} ${rounded}`;
}

export function validatePromoCode(code: string): { valid: boolean; discountDescription?: string } {
  const cleanCode = code.trim().toUpperCase();
  const promo = VALID_PROMO_CODES[cleanCode];
  if (!promo) {
    return { valid: false };
  }
  return {
    valid: true,
    discountDescription: promo.name,
  };
}
