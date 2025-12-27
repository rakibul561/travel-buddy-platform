/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { stripe } from "../../utils/stripe";
import { PaymentService } from "./payment.service";
import config from "../../config";

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event;

  const webhookSecret = config.stripe.stripeWebHookSecret;

if (!webhookSecret) {
  throw new Error("Stripe webhook secret is not configured");
}
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send("Webhook Error");
  }

  try {
    await PaymentService.handleStripeWebhookEvent(event);
  } catch (err) {
    console.error("Webhook processing failed:", err);
  }

  // ⭐ ALWAYS ACK STRIPE
  return res.status(200).json({ received: true });
};
