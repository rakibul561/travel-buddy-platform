/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { followerServices } from "./followers.service";

/* ================= GET FOLLOWERS ================= */
const getFollowers = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;

  const result = await followerServices.getfollowers(decodedUser.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Followers retrieved successfully",
    data: result.map((r) => r.follower),
  });
});

/* ================= GET FOLLOWING ================= */
const getFollowing = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;
  const result = await followerServices.getfollowing(decodedUser.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Following retrieved successfully",
    data: result.map((r) => r.following),
  });
});

/* ================= FOLLOW USER ================= */
const followUser = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;
  const { targetUserId } = req.body;

  const result = await followerServices.followUser(
    decodedUser.userId,
    targetUserId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

export const FollowerController = {
  getFollowers,
  getFollowing,

  followUser,
};
