export type CurrencyCode = "INR" | "USD" | "GBP";

const RATES: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 0.012,
  GBP: 0.0095,
};

export function getCurrencyRate(code: CurrencyCode): number {
  return RATES[code];
}

export function formatCurrency(
  n: number,
  sym: string,
  code: CurrencyCode
): string {
  if (code === "INR") {
    if (n >= 10_000_000) return `${sym}${(n / 10_000_000).toFixed(1)}Cr`;
    if (n >= 100_000) return `${sym}${(n / 100_000).toFixed(1)}L`;
    if (n >= 1_000) return `${sym}${Math.round(n / 1_000)}K`;
    return `${sym}${Math.round(n).toLocaleString()}`;
  }
  if (n >= 1_000_000) return `${sym}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${sym}${(n / 1_000).toFixed(1)}K`;
  return `${sym}${Math.round(n).toLocaleString()}`;
}

export function formatHours(n: number): string {
  return `${Math.round(n).toLocaleString()} hrs`;
}
