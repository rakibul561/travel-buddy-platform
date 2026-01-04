/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateTravelPlanDTO,
  MatchQuery,
  UpdateTravelPlanDTO,
} from "../../../types/travelPlan.types";
import ApiError from "../../errors/apiError";
import { prisma } from "../../prisma/prisma";

/* ================= CREATE ================= */

const createTravelPlan = async (
  userId: string,
  data: CreateTravelPlanDTO & { image?: string | null }
) => {
  return prisma.travelPlan.create({
    data: {
      destination: data.destination,
      country: data.country,
      city: data.city,
      image: data.image ?? null,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      travelType: data.travelType,
      description: data.description,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

interface PaginationQuery {
  page?: string;
  limit?: string;
}

const getMyTravelPlans = async (userId: string, query: PaginationQuery) => {
  // pagination calculation
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // where condition (query builder style)
  const whereCondition = {
    userId,
  };

  // main data
  const data = await prisma.travelPlan.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // total count
  const total = await prisma.travelPlan.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};

const getSingleTravelPlan = async (travelPlanId: string) => {
  const result = await prisma.travelPlan.findUnique({
    where: {
      id: travelPlanId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(404, "Travel plan not found");
  }

  return result;
};

/* ================= GET ALL ================= */

const getAllTravelPlans = async (query: Record<string, any>) => {
  const { search, travelType, page = 1, limit = 10, sortBy, sortOrder } = query;

  // Build where condition
  const whereCondition: any = {
    isActive: true, // শুধু active travel plans দেখাবে
  };

  // Search logic - destination, city, country তে search করবে
  if (search && search.trim()) {
    whereCondition.OR = [
      {
        destination: {
          contains: search,
          mode: "insensitive", // case-insensitive search
        },
      },
      {
        city: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        country: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  // Filter by travel type
  if (travelType && travelType !== "ALL") {
    whereCondition.travelType = travelType;
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // Sorting
  const orderBy: any = {};
  if (sortBy) {
    orderBy[sortBy] = sortOrder || "desc";
  } else {
    orderBy.createdAt = "desc"; // default sorting
  }

  // Execute queries
  const [data, total] = await Promise.all([
    prisma.travelPlan.findMany({
      where: whereCondition,
      orderBy: orderBy,
      skip: skip,
      take: take,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.travelPlan.count({ where: whereCondition }),
  ]);

  // Calculate meta
  const totalPage = Math.ceil(total / take);

  return {
    meta: {
      page: Number(page),
      limit: take,
      total: total,
      totalPage: totalPage,
    },
    data,
  };
};

/* ================= GET BY ID ================= */

const getTravelPlanById = async (id: string) => {
  const plan = await prisma.travelPlan.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!plan) {
    throw new ApiError(404, "Travel plan not found");
  }

  return plan;
};

/* ================= UPDATE ================= */

const updateTravelPlan = async (
  id: string,
  userId: string,
  data: UpdateTravelPlanDTO
) => {
  const plan = await prisma.travelPlan.findUnique({ where: { id } });

  if (!plan) {
    throw new ApiError(404, "Travel plan not found");
  }

  if (plan.userId !== userId) {
    throw new ApiError(403, "Unauthorized to update this plan");
  }

  return prisma.travelPlan.update({
    where: { id },
    data,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

/* ================= DELETE ================= */

const deleteTravelPlan = async (id: string, userId: string) => {
  const plan = await prisma.travelPlan.findUnique({ where: { id } });

  if (!plan) {
    throw new ApiError(404, "Travel plan not found");
  }

  if (plan.userId !== userId) {
    throw new ApiError(403, "Unauthorized to delete this plan");
  }

  await prisma.travelPlan.delete({ where: { id } });

  return { message: "Travel plan deleted successfully" };
};

/* ================= MATCH TRAVELERS ================= */

const matchTravelers = async (query: MatchQuery & { userId: string }) => {
  const {
    destination,
    startDate,
    endDate,
    minBudget,
    maxBudget,
    flexDays = 3,
    userId,
  } = query;

  const flexStartDate = new Date(startDate);
  flexStartDate.setDate(flexStartDate.getDate() - flexDays);

  const flexEndDate = new Date(endDate);
  flexEndDate.setDate(flexEndDate.getDate() + flexDays);

  const where: any = {
    destination: {
      contains: destination,
      mode: "insensitive",
    },
    userId: {
      not: userId, // 🔥 own plan exclude
    },
    isActive: true,
    AND: [
      { startDate: { lte: flexEndDate } },
      { endDate: { gte: flexStartDate } },
    ],
  };

  // ✅ Correct budget logic
  if (minBudget !== undefined) {
    where.budgetMax = { gte: minBudget };
  }

  if (maxBudget !== undefined) {
    where.budgetMin = { lte: maxBudget };
  }

  return prisma.travelPlan.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profilePicture: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const completeTrip = async (userId: string, tripId: string) => {
  const trip = await prisma.travelPlan.findUnique({
    where: { id: tripId },
  });

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  if (trip.userId !== userId) {
    throw new ApiError(403, "Only owner can complete the trip");
  }

  return prisma.travelPlan.update({
    where: { id: tripId },
    data: {
      status: "COMPLETED",
      isActive: false,
    },
  });
};

export const TravelPlanService = {
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
