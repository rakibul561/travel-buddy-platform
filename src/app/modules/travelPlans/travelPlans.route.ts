import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { TravelPlansController } from "./travelPlans.controller";

const router = Router();

/* ================= CREATE TRAVEL PLAN ================= */
router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.createTravelPlan
);

/* ================= GET ALL TRAVEL PLANS ================= */
router.get(
  "/",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.getAllTravelPlans
);

/* ================= MATCH TRAVELERS ================= */
router.get(
  "/match",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.matchTravelers
);

/* ================= GET BY ID ================= */
router.get(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.getTravelPlanById
);

/* ================= UPDATE ================= */
router.patch(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.updateTravelPlan
);

/* ================= DELETE ================= */
router.delete(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.deleteTravelPlan
);

export const TravelRoutes = router;
