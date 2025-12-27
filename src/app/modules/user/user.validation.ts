import { z } from "zod";

const createUserValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),

  fullName: z.string().min(1, "Full name is required").optional(),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export const userValidation = {
  createUserValidationSchema,
};
