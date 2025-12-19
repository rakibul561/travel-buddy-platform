/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

/* ---------------------------------------
   Create User
---------------------------------------- */
const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

/* ---------------------------------------
   Get All Users (Admin)
---------------------------------------- */
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

/* ---------------------------------------
   Get Current Logged-in User (/me)
---------------------------------------- */
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

/* ---------------------------------------
   Get User By ID (Admin)
---------------------------------------- */
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

/* ---------------------------------------
   Update Current User Profile
---------------------------------------- */
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;
  const payload = req.body;

  const updatedUser = await UserService.userUpdateProfile(
    decodedUser.userId,
    payload
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile updated successfully",
    data: updatedUser,
  });
});

/* ---------------------------------------
   Delete User (Admin)
---------------------------------------- */
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

/* ---------------------------------------
   Export
---------------------------------------- */
export const UserController = {
  createUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  deleteUser,
};
