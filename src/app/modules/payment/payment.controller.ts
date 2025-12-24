/* eslint-disable @typescript-eslint/no-explicit-any */
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createCheckout = catchAsync(async (req, res) => {
  const { plan } = req.body;
   const decodedUser = req.user as any;
    
  const url =
    await PaymentService.createSubscriptionCheckout(
      plan,
      decodedUser
    );

   sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Checkout created successfully",
    data: {url},
  });
});

const verifyBadge = catchAsync(async (req, res) => {
  const user = req.user;

  const result =
    await PaymentService.purchaseVerifiedBadge(user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Verified badge purchased",
    data: result,
  });
});

export const PaymentController = {
  createCheckout,
  verifyBadge,
};
