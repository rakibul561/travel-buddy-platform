import { z } from "zod";

export const createReviewZodSchema = z.object({
  body: z.object({
    travelPlanId: z.string().uuid(),
    reviewedId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3),
  }),
});

