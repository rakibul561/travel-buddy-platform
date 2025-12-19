/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request } from "express";

const createReview = async (req: Request) => {
  return "review create successfully";
};

export const ReviewService = {
  createReview,
};