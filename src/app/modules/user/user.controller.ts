/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

/* ================= CREATE USER ================= */

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

/* ================= GET ALL USERS ================= */

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

/* ================= CURRENT USER ================= */

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;
  const user = await UserService.getSingleUser(decodedUser.userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Current user retrieved successfully",
    data: user,
  });
});

/* ================= USER BY ID ================= */

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const user = await UserService.findUserById(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: user,
  });
});

/* ================= UPDATE PROFILE ================= */

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;

  const updatedUser = await UserService.userUpdateProfile(
    decodedUser.userId,
    req.body,
    req.file // 👈 file pass করলাম
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

/* ================= DELETE USER ================= */

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  const deletedUser = await UserService.deleteUser(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

/* ================= EXPORT ================= */

export const UserController = {
  createUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  deleteUser,
};
