/*
  Warnings:

  - A unique constraint covering the columns `[reviewerId,reviewedId,travelPlanId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `travelPlanId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TravelPlanStatus" AS ENUM ('PLANNED', 'COMPLETED');

-- DropIndex
DROP INDEX "Review_reviewedId_idx";

-- DropIndex
DROP INDEX "Review_reviewerId_reviewedId_key";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "travelPlanId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TravelPlan" ADD COLUMN     "status" "TravelPlanStatus" NOT NULL DEFAULT 'PLANNED';

-- CreateTable
CREATE TABLE "JoinRequest" (
    "id" TEXT NOT NULL,
    "travelPlanId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripParticipant" (
    "id" TEXT NOT NULL,
    "travelPlanId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JoinRequest_travelPlanId_idx" ON "JoinRequest"("travelPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinRequest_travelPlanId_requesterId_key" ON "JoinRequest"("travelPlanId", "requesterId");

-- CreateIndex
CREATE INDEX "TripParticipant_userId_idx" ON "TripParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TripParticipant_travelPlanId_userId_key" ON "TripParticipant"("travelPlanId", "userId");

-- CreateIndex
CREATE INDEX "Review_travelPlanId_idx" ON "Review"("travelPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerId_reviewedId_travelPlanId_key" ON "Review"("reviewerId", "reviewedId", "travelPlanId");

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "TravelPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripParticipant" ADD CONSTRAINT "TripParticipant_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "TravelPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripParticipant" ADD CONSTRAINT "TripParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "TravelPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
