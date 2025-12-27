/* eslint-disable @typescript-eslint/no-non-null-assertion */
import config from "../../config";


export const PRICE_MAP = {
  MONTHLY: config.stripe.monthlyPriceId!,
  YEARLY: config.stripe.yearlyPriceId!,
} as const;

