// travelPlans.validation.ts
import { z } from "zod";

export const createTravelPlanValidationSchema = z.object({
  destination: z.string().min(1),
  country: z.string().min(1),
  city: z.string().optional(),

  startDate: z.string(), // ISO string
  endDate: z.string(),

  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),

  travelType: z.enum(["SOLO", "FAMILY", "FRIENDS", "COUPLE"]),

  description: z.string().optional(),
  itinerary: z.string().optional(),
});
