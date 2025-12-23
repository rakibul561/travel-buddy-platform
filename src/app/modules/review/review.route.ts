import { Router } from "express";

import { Role } from "@prisma/client";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { createReviewZodSchema } from "./review.validation";


const router = Router();

router.post(
  "/",
  auth(Role.USER),
  validateRequest(createReviewZodSchema),
  ReviewController.createReview
);

export const ReviewRoutes = router;
