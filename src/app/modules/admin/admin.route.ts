import { Router } from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

// Only admin can access the stats
router.get(
    "/stats",
    auth(Role.ADMIN),
    AdminController.getDashboardStats
);

export const AdminRoutes = router;
