import { Role } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import passport from "../../config/passport.config";
import auth from "../../middlewares/auth";
import { fileUpload } from "../../utils/fileUpload";
import { UserController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = express.Router();

/* ================= GOOGLE AUTH ================= */

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
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

router.post(
  "/register",
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

router.get("/me", auth(Role.USER, Role.ADMIN), UserController.getCurrentUser);

// profile Update
router.patch(
  "/profile",
  auth(Role.USER, Role.ADMIN),
  fileUpload.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      return UserController.updateProfile(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", auth(Role.ADMIN), UserController.getAllUsers);

router.get("/:id", auth(Role.ADMIN), UserController.getUserById);

router.delete("/:id", auth(Role.ADMIN), UserController.deleteUser);

export const UserRoutes = router;
