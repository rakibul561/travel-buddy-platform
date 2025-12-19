/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateTravelPlanDTO,
  MatchQuery,

  UpdateTravelPlanDTO,
} from "../../../types/travelPlan.types";
import ApiError from "../../errors/apiError";
import { PrismaQueryBuilder } from "../../utils/QueryBuilder";
import { prisma } from "../../prisma/prisma";



/* ================= CREATE ================= */

const createTravelPlan = async (userId: string, data: CreateTravelPlanDTO) => {
  return prisma.travelPlan.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
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


/* ================= GET ALL ================= */

const getAllTravelPlans = async (query: Record<string, any>) => {
  const qb = new PrismaQueryBuilder(query)
    .filter()
    .search(["destination"])
    .sort()
    .paginate(); 

  const prismaQuery = qb.build();

  const [data, total] = await Promise.all([
    prisma.travelPlan.findMany({
      where: prismaQuery.where,
      orderBy: prismaQuery.orderBy,
      skip: prismaQuery.skip,
      take: prismaQuery.take,
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
    prisma.travelPlan.count({ where: prismaQuery.where }),
  ]);

  return {
    meta: qb.getMeta(total),
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

const matchTravelers = async (query: MatchQuery) => {
  const {
    destination,
    startDate,
    endDate,
    minBudget,
    maxBudget,
    flexDays = 3,
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
    AND: [
      { startDate: { lte: flexEndDate } },
      { endDate: { gte: flexStartDate } },
    ],
  };

  if (minBudget || maxBudget) {
    where.budget = {};
    if (minBudget) where.budget.gte = minBudget;
    if (maxBudget) where.budget.lte = maxBudget;
  }

  return prisma.travelPlan.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

/* ================= EXPORT ================= */

export const TravelPlanService = {
  createTravelPlan,
  getAllTravelPlans,
  getTravelPlanById,
  updateTravelPlan,
  deleteTravelPlan,
  matchTravelers,
};
