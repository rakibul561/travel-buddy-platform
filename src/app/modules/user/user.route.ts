import express, { NextFunction, Request, Response } from "express";
import passport from "../../config/passport.config";
import { UserController } from "./user.controller";
import { fileUpload } from "../../utils/fileUpload";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = express.Router();

/* ================= GOOGLE AUTH ================= */

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req: Request, res: Response) => {
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`
    );
  }
);

/* ================= CREATE USER ================= */

router.post(
  "/",
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = userValidation.createUserValidationSchema.parse(
        JSON.parse(req.body.data)
      );
      return UserController.createUser(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

/* ================= CURRENT USER ================= */

router.get(
  "/me",
  auth(Role.USER, Role.ADMIN),
  UserController.getCurrentUser
);

/* ================= UPDATE PROFILE ================= */

router.patch(
  "/profile",
  auth(Role.USER, Role.ADMIN),
  UserController.updateProfile
);

/* ================= ADMIN ROUTES ================= */

router.get(
  "/",
  auth(Role.ADMIN),
  UserController.getAllUsers
);

router.get(
  "/:id",
  auth(Role.ADMIN),
  UserController.getUserById
);

router.delete(
  "/:id",
  auth(Role.ADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
