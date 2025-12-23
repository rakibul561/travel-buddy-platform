import { Router } from "express";
import { Role } from "@prisma/client";
import { JoinRequestController } from "./joinRequest.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  JoinRequestController.sendJoinRequest
);

router.get(
  "/my-trips",
  auth(Role.USER, Role.ADMIN),
  JoinRequestController.getRequestsForMyTrips
);

router.patch(
  "/:id",
  auth(Role.USER),
  JoinRequestController.updateJoinRequestStatus
);

export const JoinRequestRoutes = router;
