import Stripe from "stripe";
import { stripe } from "../../utils/stripe";
import { prisma } from "../../prisma/prisma";
import { SubscriptionPlan } from "@prisma/client";

/* ================== PRICE IDS ================== */
const PRICE_MAP = {
  MONTHLY: "price_MONTHLY_ID_FROM_STRIPE",
  YEARLY: "price_YEARLY_ID_FROM_STRIPE"
};

// CREATE CHECKOUT
const createSubscriptionCheckout = async (
  planType: "MONTHLY" | "YEARLY",
  userEmail: string
) => {
  const user = await prisma.user.findUnique({
    where: { email: userEmail }
  });

  if (!user) throw new Error("User not found");

  if (user.subscriptionPlan !== SubscriptionPlan.FREE) {
    throw new Error("Already subscribed");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: user.email,

    line_items: [
      {
        price: PRICE_MAP[planType],
        quantity: 1
      }
    ],

    metadata: {
      userId: user.id,
      userEmail: user.email,
      planType
    },

    success_url: "http://localhost:3000/payment/success",
    cancel_url: "http://localhost:3000/payment/cancel"
  });

  return {
    sessionId: session.id,
    url: session.url
  };
};

// HANDLE WEBHOOK
const handleStripeWebhooksEvent = async (event: Stripe.Event) => {
  if (event.type !== "checkout.session.completed") return;

  const session = event.data.object as Stripe.Checkout.Session;

  const userId = session.metadata?.userId;
  const planType = session.metadata?.planType as "MONTHLY" | "YEARLY";

  if (!userId || !planType) {
    console.log("❌ Missing metadata");
    return;
  }

  const duration = planType === "MONTHLY" ? 30 : 365;

  const subscriptionEndsAt = new Date();
  subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + duration);

  const plan =
    planType === "MONTHLY"
      ? SubscriptionPlan.MONTHLY
      : SubscriptionPlan.YEARLY;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan,
        isVerified: true,
        subscriptionEndsAt
      }
    });

    await tx.payment.create({
      data: {
        userId,
        amount: (session.amount_total ?? 0) / 100,
        currency: "BDT",
        status: "completed",
        transactionId: session.payment_intent as string,
        plan
      }
    });
  });

  console.log("✅ Subscription activated for user:", userId);
};

// VERIFY SUBSCRIPTION
const verifySubscription = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw new Error("User not found");

  const now = new Date();

  if (
    user.subscriptionPlan !== SubscriptionPlan.FREE &&
    user.subscriptionEndsAt &&
    now > user.subscriptionEndsAt
  ) {
    await prisma.user.update({
      where: { email },
      data: {
        subscriptionPlan: SubscriptionPlan.FREE,
        isVerified: false,
        subscriptionEndsAt: null
      }
    });

    return {
      isPremium: false,
      subscriptionPlan: "FREE",
      subscriptionEndsAt: null
    };
  }

  return {
    isPremium: user.subscriptionPlan !== SubscriptionPlan.FREE,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionEndsAt: user.subscriptionEndsAt
  };
};

// PAYMENT HISTORY
const getPaymentHistory = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  if (!user) throw new Error("User not found");

  return prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });
};

export const PaymentService = {
  createSubscriptionCheckout,
  handleStripeWebhooksEvent,
  verifySubscription,
  getPaymentHistory
};
