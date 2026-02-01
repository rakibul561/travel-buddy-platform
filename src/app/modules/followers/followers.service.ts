import { prisma } from "../../prisma/prisma";

const getfollowers = async (userId: string) => {
  const result = await prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
  });

  return result;
};

const getfollowing = async (userId: string) => {
  return prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
  });
};

const followUser = async (userId: string, targetUserId: string) => {
  return prisma.follow.create({
    data: {
      userId: userId,
      followerId: userId,
      followingId: targetUserId,
    },
  });
};

/* ================= FRIEND PROFILE ================= */
// const getFriendProfile = async (
//   targetUserId: string,
//   currentUserId: string,
// ) => {
//   /* -------- BASIC USER INFO -------- */
//   const user = await prisma.user.findUnique({
//     where: { id: targetUserId },
//     select: {

//       subscription: {
//         select: { status: true },
//       },
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   /* -------- follow STATUS -------- */
//   const isfollowing = await prisma.follow.findFirst({
//     where: {
//       followerId: currentUserId,
//       followingId: targetUserId,
//     },
//   });

//   /* -------- WEEKLY XP (FROM userProgress) -------- */
//   const today = new Date();
//   today.setHours(23, 59, 59, 999);

//   const fromDate = new Date();
//   fromDate.setDate(today.getDate() - 6);
//   fromDate.setHours(0, 0, 0, 0);

//   const progresses = await prisma.userProgress.findMany({
//     where: {
//       userId: targetUserId,
//       status: "COMPLETED",
//       completedAt: {
//         gte: fromDate,
//         lte: today,
//       },
//     },
//     select: {
//       completedAt: true,
//       metadata: true,
//     },
//   });

//   const pointsMap: Record<string, number> = {};

//   for (const p of progresses) {
//     const meta = p.metadata as { totalPoints?: number } | null;
//     const points = meta?.totalPoints ?? 0;

//     const dateKey = p.completedAt.toISOString().split("T")[0];
//     pointsMap[dateKey] = (pointsMap[dateKey] || 0) + points;
//   }

//   const weeklyProgress = Array.from({ length: 7 }).map((_, i) => {
//     const date = new Date(fromDate);
//     date.setDate(fromDate.getDate() + i);

//     const key = date.toISOString().split("T")[0];

//     return {
//       date: key,
//       xp: pointsMap[key] || 0,
//     };
//   });

//   /* -------- WEEKLY TOTAL XP -------- */
//   const weeklyTotalXp = weeklyProgress.reduce((sum, day) => sum + day.xp, 0);

//   /* -------- STREAK -------- */
//   const streak = await prisma.dailyStreak.findUnique({
//     where: { userId: targetUserId },
//     select: { currentStreak: true },
//   });

//   /* -------- VOCABULARY -------- */
//   const vocabularyCount = await prisma.dictionaryWord.count({
//     where: { userId: targetUserId },
//   });

//   /* -------- CHAPTER PROGRESS -------- */
//   const completed = await prisma.masteryProgress.count({
//     where: {
//       userId: targetUserId,
//       completedLessons: { gt: 0 },
//     },
//   });

//   const total = await prisma.masteryProgress.count({
//     where: { userId: targetUserId },
//   });

//   /* -------- CLASS -------- */
//   let userClass = "Bronze";
//   if ((user.totalPoints || weeklyTotalXp) >= 500) userClass = "Silver";
//   if ((user.totalPoints || weeklyTotalXp) >= 1500) userClass = "Gold";

//   /* -------- FINAL RESPONSE -------- */
//   return {
//     user: {
//       fullName: user.fullName,
//       userName: user.userName,
//       image: user.image,
//       joinedAt: user.createdAt,
//       isPremium: user.subscription?.status === "ACTIVE",
//       isfollowing: !!isfollowing,
//     },
//     weeklyProgress,
//     streak: streak?.currentStreak || 0,
//     vocabularyCount,
//     chapterProgress: `${completed}/${total}`,
//     exp: user.totalPoints > 0 ? user.totalPoints : weeklyTotalXp,
//     class: userClass,
//   };
// };

export const followerServices = {
  getfollowers,
  getfollowing,
  followUser,
  // getFriendProfile,
};
