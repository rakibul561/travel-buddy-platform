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
      
      const parsedData = createTravelPlanValidationSchema.parse(
        JSON.parse(req.body.data)
      );

      req.body = parsedData;

      return TravelPlansController.createTravelPlan(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
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

router.get(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.getTravelPlanById
);

router.patch(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.updateTravelPlan
);

 
// Trip complete
router.patch(
  "/:id/complete",
  auth(Role.USER),
  TravelPlansController.completeTrip
);


router.delete(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  TravelPlansController.deleteTravelPlan
);

export const TravelRoutes = router;
