/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { stripe } from "../../utils/stripe";
import { prisma } from "../../prisma/prisma";

export const stripeWebhook = async (req: any, res: any) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed", err);
    return res.status(400).send("Webhook Error");
  }

  // 🔥 DEBUG: webhook hit
  console.log("🔥 WEBHOOK HIT:", event.type);

if (event.type === "invoice.payment_succeeded") {
  const invoice = event.data.object as any;

  const subscriptionId = invoice.subscription as string;
  const customerId = invoice.customer as string;

  // subscription details
  const subscription =
    await stripe.subscriptions.retrieve(subscriptionId);

  const price = subscription.items.data[0].price;
  const plan =
    price.recurring?.interval === "year"
      ? "YEARLY"
      : "MONTHLY";

  // customer metadata (userId এখানে থাকে)
  const customer =
    await stripe.customers.retrieve(customerId) as any;

  const userId = customer.metadata?.userId;

  console.log("🟢 USER ID FROM CUSTOMER:", userId);

  if (!userId) return res.json({ received: true });

  // 🧾 save payment
  await prisma.payment.create({
    data: {
      userId,
      amount: (invoice.amount_paid ?? 0) / 100,
      currency: invoice.currency.toUpperCase(),
      status: "SUCCESS",
      transactionId: invoice.id,
      plan,
    },
  });

  // 🔄 update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionPlan: plan,
      subscriptionEndsAt: new Date(
        subscription.current_period_end * 1000
      ),
    },
  });

  console.log("✅ PAYMENT & SUBSCRIPTION SAVED");
}


  return res.json({ received: true });
};
