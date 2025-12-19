import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ReviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "review created successfully",
    data: result,
  });
});

export const ReviewController = {
  createReview,
};