/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import { stripe } from "../../utils/stripe";
import { PRICE_MAP } from "./payment.constant";
import ApiError from "../../errors/apiError";
import { prisma } from "../../prisma/prisma";

/**
 * SUBSCRIPTION CHECKOUT
 */
const createSubscriptionCheckout = async (plan: "MONTHLY" | "YEARLY",decodedUser:any) => {
  
    

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: decodedUser.email,

    line_items: [
      { price: PRICE_MAP[plan], quantity: 1 }
    ],
    metadata: {
      userId: decodedUser.userId,
      plan,
    },

    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
    
  console.log(session)
  
  return session.url;
};



/**
 * VERIFIED BADGE (AFTER SUBSCRIPTION)
 */
const purchaseVerifiedBadge = async (user: any) => {
  if (user.subscriptionPlan === "FREE") {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Subscription required"
    );
  }

  if (user.isVerified) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Already verified"
    );
  }

  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: 10,
      currency: "USD",
      status: "SUCCESS",
      transactionId: `badge_${Date.now()}`,
      plan: user.subscriptionPlan,
    },
  });

  return prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });
};

export const PaymentService = {
  createSubscriptionCheckout,
  purchaseVerifiedBadge,
};
