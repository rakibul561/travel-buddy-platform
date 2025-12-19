import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { fileUpload } from "../../utils/fileUpload";
import { userValidation } from "./user.validation";
import passport from "../../config/passport.config";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Existing routes
router.post("/",
    fileUpload.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createUserValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createUser(req, res, next)
    }
);

router.patch("/profile", auth(UserRole.USER, UserRole.ADMIN), fileUpload.upload.single("file"), UserController.userUpdateProfile);

// Get current user (protected)
router.get("/me", auth(UserRole.USER, UserRole.ADMIN), UserController.getSingleUser);

// FIND USER BY ID (protected)
router.get("/:id", auth( UserRole.ADMIN), UserController.getFindUserById);

// GET ALL USERS (protected)
router.get("/", auth(UserRole.ADMIN), UserController.getAllUsers);

// DELETE USER BY ID (protected)
router.delete("/:id", auth(UserRole.ADMIN), UserController.deleteUser);



// New Google OAuth routes
router.get(
    "/auth/google",
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get( "/auth/google/callback",
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureMessage: true
    }),
    (req: Request, res: Response) => {
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
    }
);



export const UserRoutes = router;