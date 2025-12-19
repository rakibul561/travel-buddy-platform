import { TravelType } from '@prisma/client';

export interface CreateTravelPlanDTO {
  destination: string;
  country: string;
  city?: string;
  startDate: Date;
  endDate: Date;
  budgetMin?: number;
  budgetMax?: number;
  travelType: TravelType;
  description?: string;
  itinerary?: string;
}

export interface UpdateTravelPlanDTO {
  destination?: string;
  country?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  budgetMin?: number;
  budgetMax?: number;
  travelType?: TravelType;
  description?: string;
  itinerary?: string;
  isActive?: boolean;
}

export interface TravelPlanQuery {
  destination?: string;
  country?: string;
  minBudget?: number;
  maxBudget?: number;
  startDate?: Date;
  endDate?: Date;
  travelType?: TravelType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface MatchQuery {
  destination?: string;
  country?: string;
  startDate: Date;
  endDate: Date;
  minBudget?: number;
  maxBudget?: number;
  travelType?: TravelType;
  flexDays?: number; // date flexibility in days
}