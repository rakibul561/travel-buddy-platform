/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import ApiError from "../../errors/apiError";
import catchAsync from "../../utils/catchAsync";
import { fileUpload } from "../../utils/fileUpload";
import sendResponse from "../../utils/sendResponse";
import { TravelPlanService } from "./travelPlans.service";

const createTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;

  let image: string | null = null;

  // 🔥 Cloudinary upload
  if (req.file) {
    const uploadResult = await fileUpload.uploadToCloudinary(req.file);

    image = uploadResult?.secure_url || null;
  }

  const payload = {
    ...req.body,
    image,
  };

  const travelPlan = await TravelPlanService.createTravelPlan(userId, payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Travel plan created successfully",
    data: travelPlan,
  });
});

const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TravelPlanService.getSingleTravelPlan(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan retrieved successfully",
    data: result,
  });
});

/* ================= GET MY TRAVEL ================= */

const getMyTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const decodedUser = req.user as any;

  const query = req.query;

  if (!decodedUser) {
    throw new ApiError(200, "decodedUser is not found");
  }

  const result = await TravelPlanService.getMyTravelPlans(
    decodedUser.userId,
    query
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My travel plans retrieved successfully",
    data: result.data,
  });
});

/* ================= GET ALL ================= */
const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
  const result = await TravelPlanService.getAllTravelPlans(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plans retrieved successfully",
    data: result,
  });
});

/* ================= GET BY ID ================= */

const getTravelPlanById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const travelPlan = await TravelPlanService.getTravelPlanById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan retrieved successfully",
    data: travelPlan,
  });
});

/* ================= UPDATE ================= */

const updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).userId;

  const updatedPlan = await TravelPlanService.updateTravelPlan(
    id,
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan updated successfully",
    data: updatedPlan,
  });
});

/* ================= DELETE ================= */

const deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req.user as any).userId;

  await TravelPlanService.deleteTravelPlan(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan deleted successfully",
    data: null,
  });
});

const matchTravelers = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;

  if (!req.query.destination || !req.query.startDate || !req.query.endDate) {
    throw new ApiError(400, "Destination and date range are required");
  }

  const query = {
    destination: req.query.destination as string,
    startDate: new Date(req.query.startDate as string),
    endDate: new Date(req.query.endDate as string),
    minBudget: req.query.minBudget ? Number(req.query.minBudget) : undefined,
    maxBudget: req.query.maxBudget ? Number(req.query.maxBudget) : undefined,
    flexDays: req.query.flexDays ? Number(req.query.flexDays) : 3,
    userId,
  };

  const matches = await TravelPlanService.matchTravelers(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Matching travel plans retrieved successfully",
    data: matches,
  });
});

const completeTrip = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const { id } = req.params;

  const result = await TravelPlanService.completeTrip(userId, id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Trip marked as completed",
    data: result,
  });
});

export const TravelPlansController = {
  createTravelPlan,
  getAllTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan,
  matchTravelers,
  completeTrip,
  getMyTravelPlans,
  getSingleTravelPlan,
};
