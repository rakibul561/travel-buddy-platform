import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";
import { MessageController } from "./message.controller";

const router = Router();

router.get("/:travelPlanId", auth(Role.USER, Role.ADMIN), MessageController.getMessagesByTravelPlanId);

export const MessageRoutes = router;
