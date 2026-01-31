/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";

export const createCheckout = catchAsync(
  async (req: Request, res: Response) => {
    const { plan } = req.body;

    const decodedUser = req.user as any;

    if (!plan) {
      return res.status(400).json({ message: "Plan is required" });
    }

    const url = await PaymentService.createSubscriptionCheckout(
      decodedUser.userId,
      plan
    );

    res.json({
      success: true,
      url,
    });
  }
);
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await PaymentService.getAllPayments(page, limit);

  res.status(200).json({
    success: true,
    message: "Payments retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const PaymentController = {
  createCheckout,
  getAllPayments,
};
