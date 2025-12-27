/* eslint-disable @typescript-eslint/no-unused-vars */
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../prisma/prisma";
import { stripe } from "../../utils/stripe";
import { SubscriptionPlan } from "@prisma/client";

const PRICE_MAP = {
  MONTHLY: config.stripe.monthlyPriceId,
  YEARLY: config.stripe.yearlyPriceId,
};

 const createSubscriptionCheckout = async (userId: string,plan: "MONTHLY" | "YEARLY") => {


  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  

  if (!user) throw new Error("User not found");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,

    line_items: [
      {
        price: PRICE_MAP[plan],
        quantity: 1,
      },
    ],

    success_url: `${config.stripe.frontendUrl}/payment/success`,
    cancel_url: `${config.stripe.frontendUrl}/payment/cancel`,

    metadata: {
      userId: user.id,
      plan,
    },
  });

  return session.url;
};


// payment.service.ts - handleStripeWebhookEvent function

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as "MONTHLY" | "YEARLY";

      if (!userId || !plan) {
        console.warn("⚠️ Missing metadata");
        return;
      }

      const existing = await prisma.payment.findUnique({
        where: { transactionId: session.id },
      });

      if (!existing) {
        await prisma.payment.create({
          data: {
            userId,
            transactionId: session.id,
            amount: (session.amount_total ?? 0) / 100,
            currency: session.currency ?? "USD",
            plan,
            status: "PAID",
          },
        });
      }

      // ✅ Update subscription AND verify user
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: plan,
          subscriptionEndsAt:
            plan === "MONTHLY"
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          // ✅ Verified badge
          isVerified: true,
          verifiedAt: new Date(),
        },
      });

     
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      
      
   
      
      // TODO: Remove verified badge when subscription ends
      break;
    }

    default:
      
  }
};




export const PaymentService = {
  createSubscriptionCheckout,
  handleStripeWebhookEvent
};