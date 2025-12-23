
import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import { prisma } from "../../prisma/prisma";

const createReview = async (
  reviewerId: string,
  payload: {
    travelPlanId: string;
    reviewedId: string;
    rating: number;
    comment: string;
  }
) => {
  const { travelPlanId, reviewedId, rating, comment } = payload;

  // 1️⃣ Rating validation
  if (rating < 1 || rating > 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rating must be between 1 and 5"
    );
  }

  // 2️⃣ Trip check (must be COMPLETED)
  const trip = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
    include: { participants: true },
  });

  if (!trip || trip.status !== "COMPLETED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Trip is not completed yet"
    );
  }

  // 3️⃣ Only participants can review
  const participantIds = trip.participants.map(p => p.userId);

  if (
    !participantIds.includes(reviewerId) ||
    !participantIds.includes(reviewedId)
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Only trip participants can review each other"
    );
  }

  // 4️⃣ Prevent duplicate review (one review per trip)
  const existingReview = await prisma.review.findFirst({
    where: {
      reviewerId,
      reviewedId,
      travelPlanId,
    },
  });

  if (existingReview) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already reviewed this user for this trip"
    );
  }

  // 5️⃣ Create review
  return prisma.review.create({
    data: {
      reviewerId,
      reviewedId,
      travelPlanId,
      rating,
      comment,
    },
  });
};

export const ReviewService = {
  createReview,
};
