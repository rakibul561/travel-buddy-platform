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
  auth(Role.USER, Role.ADMIN),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // form-data এর text অংশ parse + validate
      const parsedData = createTravelPlanValidationSchema.parse(
        JSON.parse(req.body.data)
      );

      // validated data overwrite
      req.body = parsedData;

      return TravelPlansController.createTravelPlan(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);


/* ================= GET ALL TRAVEL PLANS ================= */
router.get(
  "/",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.getAllTravelPlans
);

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
