// Display-only multi-currency (buyer directive 2026-07-10).
// Amounts move through the system in each EVENT's own currency, in integer
// minor units (paise/cents/fils — all 2-digit). Orders are still CREATED and
// CHARGED server-side in the event's currency (Stripe). This module only
// CONVERTS amounts for DISPLAY into the currency the visitor selects.
//
// Rates are a static, approximate config (1 unit of currency ≈ X INR). Swap for
// a live FX feed later if real-time accuracy is needed — display only, so a
// stale rate never affects what a buyer is actually charged.

export const CURRENCIES = ['INR', 'AED', 'USD', 'GBP', 'EUR', 'SGD'];

export const CURRENCY_SYMBOL = { INR: '₹', AED: 'AED ', USD: '$', GBP: '£', EUR: '€', SGD: 'S$' };
export const CURRENCY_LABEL = { INR: 'INR ₹', AED: 'AED د.إ', USD: 'USD $', GBP: 'GBP £', EUR: 'EUR €', SGD: 'SGD S$' };

// 1 unit of the currency ≈ this many INR (approx; display only).
export const RATES_TO_INR = { INR: 1, AED: 22.6, USD: 83, GBP: 105, EUR: 90, SGD: 62 };

const LOCALE = { INR: 'en-IN', AED: 'en-AE', USD: 'en-US', GBP: 'en-GB', EUR: 'en-IE', SGD: 'en-SG' };

// Convert an integer minor amount from one currency to another (both 2-digit
// minor units, so the ×100 cancels: minor_to = minor_from × rateFrom / rateTo).
export function convertMinor(minor, from = 'INR', to = 'INR') {
  const v = Number(minor) || 0;
  if (from === to) return Math.round(v);
  const inInr = v * (RATES_TO_INR[from] ?? 1);
  return Math.round(inInr / (RATES_TO_INR[to] ?? 1));
}

// Format an integer minor amount already IN `currency`.
export function formatMoney(minor, currency = 'INR') {
  const sym = CURRENCY_SYMBOL[currency] || `${currency} `;
  const amount = (Number(minor) || 0) / 100;
  return sym + amount.toLocaleString(LOCALE[currency] || 'en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// Convert `minor` (held in `from`) into `to` and format it. This is the main
// display helper — e.g. displayMoney(50000, 'INR', 'AED').
export function displayMoney(minor, from = 'INR', to = 'INR') {
  return formatMoney(convertMinor(minor, from, to), to);
}

const isCurrency = (c) => CURRENCIES.includes(c);

// Map the visitor's IANA timezone → a supported display currency. Location-based
// default (buyer directive): the currency auto-changes with where they are.
// Falls back to locale, then INR ('English'/default).
const TZ_CURRENCY = [
  [/dubai|abu_dhabi|asia\/muscat|asia\/qatar|asia\/bahrain|asia\/riyadh|asia\/kuwait/i, 'AED'],
  [/asia\/kolkata|asia\/calcutta|asia\/colombo/i, 'INR'],
  [/asia\/singapore|asia\/kuala_lumpur/i, 'SGD'],
  [/^america\//i, 'USD'],
  [/europe\/london|europe\/dublin/i, 'GBP'],
  [/^europe\//i, 'EUR'],
];
const LOCALE_CURRENCY = { AE: 'AED', IN: 'INR', SG: 'SGD', US: 'USD', GB: 'GB', UK: 'GBP', DE: 'EUR', FR: 'EUR', IE: 'EUR', ES: 'EUR', IT: 'EUR', NL: 'EUR' };

// A stored user choice always wins; otherwise derive from location.
export function detectDefaultCurrency() {
  try {
    const stored = localStorage.getItem('obs_currency');
    if (stored && isCurrency(stored)) return stored;
  } catch { /* ignore */ }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    for (const [re, cur] of TZ_CURRENCY) if (re.test(tz)) return cur;
    const region = (navigator.language || '').split('-')[1]?.toUpperCase();
    if (region && LOCALE_CURRENCY[region] && isCurrency(LOCALE_CURRENCY[region])) return LOCALE_CURRENCY[region];
  } catch { /* ignore */ }
  return 'INR';
}
