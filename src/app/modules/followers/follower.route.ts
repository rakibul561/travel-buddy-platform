import express from "express";
import auth from "../../middlewares/auth";
import { FollowerController } from "./follower.controller";

const router = express.Router();

router.get("/", auth(), FollowerController.getFollowers);

router.get("/following", auth(), FollowerController.getFollowing);

router.post("/", auth(), FollowerController.followUser);

export const FollowerRoutes = router;
