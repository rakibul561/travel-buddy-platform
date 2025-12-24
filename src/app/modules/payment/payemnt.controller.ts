/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import config from "../../config";
import { stripe } from "../../utils/stripe";
import { PaymentService } from "./payment.service";

// CREATE CHECKOUT
const createSubscriptionCheckout = catchAsync(async (req: Request, res: Response) => {
  const { planType } = req.body;
  const user = req.user as any;

  if (!user?.email) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated"
    });
  }

  const result = await PaymentService.createSubscriptionCheckout(
    planType,
    user.email
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Checkout session created",
    data: result
  });
});

// STRIPE WEBHOOK
const handleStripeWebhooksEvent = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!config.stripe.stripeWebHookSecret) {
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Stripe webhook secret not configured"
    });
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    config.stripe.stripeWebHookSecret
  );

  await PaymentService.handleStripeWebhooksEvent(event);

  // ⚠️ Stripe only needs 200
  return res.status(200).send("ok");
});

// VERIFY SUBSCRIPTION
const verifySubscription = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await PaymentService.verifySubscription(user.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription status retrieved",
    data: result
  });
});

// PAYMENT HISTORY
const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as any;

  const result = await PaymentService.getPaymentHistory(user.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment history retrieved",
    data: result
  });
});

export const PaymentController = {
  createSubscriptionCheckout,
  handleStripeWebhooksEvent,
  verifySubscription,
  getPaymentHistory
};
