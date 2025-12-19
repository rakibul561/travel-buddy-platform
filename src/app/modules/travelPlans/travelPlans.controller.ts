/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TravelPlanService } from "./travelPlans.service";

/* ================= CREATE ================= */

const createTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;

  const travelPlan = await TravelPlanService.createTravelPlan(
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Travel plan created successfully",
    data: travelPlan,
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

/* ================= MATCH ================= */

const matchTravelers = catchAsync(async (req: Request, res: Response) => {
  const query = {
    destination: req.query.destination as string,
    startDate: new Date(req.query.startDate as string),
    endDate: new Date(req.query.endDate as string),
    minBudget: req.query.minBudget
      ? Number(req.query.minBudget)
      : undefined,
    maxBudget: req.query.maxBudget
      ? Number(req.query.maxBudget)
      : undefined,
    flexDays: req.query.flexDays ? Number(req.query.flexDays) : 3,
  };

  const matches = await TravelPlanService.matchTravelers(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Matching travel plans retrieved successfully",
    data: matches,
  });
});

/* ================= EXPORT ================= */

export const TravelPlansController = {
  createTravelPlan,
  getAllTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan,
  matchTravelers,
};
