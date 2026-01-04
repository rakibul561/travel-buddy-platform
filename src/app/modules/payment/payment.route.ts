import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { createCheckout, PaymentController } from "./payment.controller";

const router = Router();

router.post("/subscription", auth(Role.USER), createCheckout);
router.get("/", auth("ADMIN"), PaymentController.getAllPayments);

export const PaymentRoutes = router;
