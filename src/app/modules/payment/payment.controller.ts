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

export const PaymentController = {
  createCheckout,
};

