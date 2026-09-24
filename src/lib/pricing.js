// Bulk discount tiers, shared by the cart UI and the order API so the
// customer always sees the same total the server charges.
export const DISCOUNT_TIERS = [
  { min: 2, max: 10, rate: 0.1 },
  { min: 11, max: 16, rate: 0.14 },
  { min: 17, max: 24, rate: 0.18 },
  { min: 25, max: Infinity, rate: 0.24 },
];

export function discountRate(totalQty) {
  const tier = DISCOUNT_TIERS.find((t) => totalQty >= t.min && totalQty <= t.max);
  return tier ? tier.rate : 0;
}

export function nextTier(totalQty) {
  return DISCOUNT_TIERS.find((t) => t.min > totalQty) || null;
}

export function priceLines(lines) {
  const totalQty = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const rate = discountRate(totalQty);
  const discount = Math.round(subtotal * rate);
  return { totalQty, subtotal, rate, discount, total: subtotal - discount };
}

export function formatINR(value) {
  return "₹" + Math.round(Number(value) || 0).toLocaleString("en-IN");
}
