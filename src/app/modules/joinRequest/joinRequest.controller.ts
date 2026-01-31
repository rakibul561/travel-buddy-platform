/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { JoinRequestService } from "./joinRequest.service";

const sendJoinRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as any).userId;
  const { travelPlanId } = req.body;

  const result = await JoinRequestService.sendJoinRequest(userId, travelPlanId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Join request sent successfully",
    data: result,
  });
});

const getRequestsForMyTrips = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;

    const result = await JoinRequestService.getRequestsForMyTrips(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Join requests retrieved",
      data: result,
    });
  },
);

const updateJoinRequestStatus = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req.user as any).userId;
    const { id } = req.params;
    const { status } = req.body;

    const result = await JoinRequestService.updateJoinRequestStatus(
      userId,
      id,
      status,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: `Join request ${status}`,
      data: result,
    });
  },
);

export const JoinRequestController = {
  sendJoinRequest,
  getRequestsForMyTrips,
  updateJoinRequestStatus,
};
