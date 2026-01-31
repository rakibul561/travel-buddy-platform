import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    travelPlanId: z.string(),
    reviewedId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3),
  }),
});

