import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { FollowerRoutes } from "../modules/followers/follower.route";
import { JoinRequestRoutes } from "../modules/joinRequest/joinRequest.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { TravelRoutes } from "../modules/travelPlans/travelPlans.route";
import { UserRoutes } from "../modules/user/user.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { MessageRoutes } from "../modules/message/message.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/auth", AuthRoutes);
router.use("/otp", OtpRoutes);
router.use("/travel-plans", TravelRoutes);
router.use("/join-requests", JoinRequestRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/follow", FollowerRoutes);
router.use("/payment", PaymentRoutes);
router.use("/admin", AdminRoutes);
router.use("/messages", MessageRoutes);

export default router;
