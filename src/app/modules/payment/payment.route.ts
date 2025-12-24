import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/subscription",
  auth(Role.USER),
  PaymentController.createCheckout
);

router.post(
  "/verify-badge",
  auth(Role.USER),
  PaymentController.verifyBadge
);

export const PaymentRoutes = router;
