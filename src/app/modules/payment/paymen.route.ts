import express from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { PaymentController } from "./payemnt.controller";


const router = express.Router();

// Create subscription checkout
router.post(
  "/",
  auth(Role.USER),
  PaymentController.createSubscriptionCheckout
);

// Verify subscription
router.get(
  "/verify-subscription",
  auth(Role.USER),
  PaymentController.verifySubscription
);

// Payment history
router.get(
  "/payment-history",
  auth(Role.USER),
  PaymentController.getPaymentHistory
);

export const PaymentRoutes = router;
