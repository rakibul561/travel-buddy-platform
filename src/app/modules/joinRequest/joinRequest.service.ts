import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import { prisma } from "../../prisma/prisma";

const sendJoinRequest = async (userId: string, travelPlanId: string) => {
  const travelPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!travelPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, "Travel plan not found");
  }

  if (travelPlan.userId === userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You cannot join your own trip");
  }

  return prisma.joinRequest.create({
    data: {
      travelPlanId,
      requesterId: userId,
    },
  });
};

const getRequestsForMyTrips = async (userId: string) => {
  return prisma.joinRequest.findMany({
    where: {
      travelPlan: {
        userId,
      },
    },
    include: {
      requester: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
      travelPlan: {
        select: {
          destination: true,
        },
      },
    },
  });
};

const updateJoinRequestStatus = async (
  ownerId: string,
  requestId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  const request = await prisma.joinRequest.findUnique({
    where: { id: requestId },
    include: { travelPlan: true },
  });

  if (!request) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  if (request.travelPlan.userId !== ownerId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not allowed");
  }

  const updated = await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status },
  });

  // ✅ ACCEPT হলে participant বানাও
  if (status === "ACCEPTED") {
    await prisma.tripParticipant.create({
      data: {
        travelPlanId: request.travelPlanId,
        userId: request.requesterId,
      },
    });
  }

  return updated;
};

export const JoinRequestService = {
  sendJoinRequest,
  getRequestsForMyTrips,
  updateJoinRequestStatus,
};
