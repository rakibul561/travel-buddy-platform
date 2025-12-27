import { Router } from "express";
import auth from "../../middlewares/auth";
import { createCheckout } from "./payment.controller";
import { Role } from "@prisma/client";

const router = Router();

router.post(
  "/subscription",
  auth(Role.USER, Role.ADMIN),
  createCheckout
);

export const PaymentRoutes = router;
