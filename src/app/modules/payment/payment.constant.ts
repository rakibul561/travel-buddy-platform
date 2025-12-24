/* eslint-disable @typescript-eslint/no-non-null-assertion */
import config from "../../config";

console.log("MONTHLY PRICE ID =>", config.stripe.monthlyPriceId);
console.log("YEARLY PRICE ID =>", config.stripe.yearlyPriceId);

export const PRICE_MAP = {
  MONTHLY: config.stripe.monthlyPriceId!,
  YEARLY: config.stripe.yearlyPriceId!,
} as const;

