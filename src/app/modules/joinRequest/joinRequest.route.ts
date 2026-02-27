import { Role } from "@prisma/client";
import { Router } from "express";
import auth from "../../middlewares/auth";
import { JoinRequestController } from "./joinRequest.controller";

const router = Router();

router.post(
  "/",
  auth(Role.USER, Role.ADMIN),
  JoinRequestController.sendJoinRequest,
);

router.get(
  "/received-requests",
  auth(Role.USER, Role.ADMIN),
  JoinRequestController.getRequestsForMyTrips,
);

router.get(
  "/my-requests",
  auth(Role.USER, Role.ADMIN),
  JoinRequestController.getMySentRequests,
);

router.patch(
  "/:id",
  auth(Role.USER, Role.ADMIN),
  JoinRequestController.updateJoinRequestStatus,
);

export const JoinRequestRoutes = router;
