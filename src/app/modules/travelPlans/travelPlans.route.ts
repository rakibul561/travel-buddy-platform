import { NextFunction, Request, Response, Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { TravelPlansController } from "./travelPlans.controller";
import { fileUpload } from "../../utils/fileUpload";
import { createTravelPlanValidationSchema } from "./travelPlans.validation";

const router = Router();

/* ================= CREATE TRAVEL PLAN ================= */
router.post(
  "/",
   fileUpload.upload.single("file"),
   (req:Request, res:Response, next:NextFunction) => {
      try {
     req.body = createTravelPlanValidationSchema.parse(
      JSON.parse(req.body.data)
     );
     return TravelPlansController.createTravelPlan(req, res, next);
   } catch (error) {
    next(error)
   }
   }
  
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
