import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { TravelRoutes } from "../modules/travelPlans/travelPlans.route";
import { JoinRequestRoutes } from "../modules/joinRequest/joinRequest.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { PaymentRoutes } from "../modules/payment/paymen.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/otp",OtpRoutes);
router.use("/travel-plans",TravelRoutes)
router.use("/join-requests",JoinRequestRoutes)
router.use("/reviews",ReviewRoutes)
router.use("/subscriptions",PaymentRoutes)


export default router;