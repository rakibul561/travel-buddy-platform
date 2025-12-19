import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { TravelRoutes } from "../modules/travelPlans/travelPlans.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/otp",OtpRoutes);
router.use("/travel-plans",TravelRoutes)


export default router;