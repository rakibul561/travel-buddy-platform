import { prisma } from "../../prisma/prisma";

const getfollowers = async (userId: string) => {
  const result = await prisma.follow.findMany({
    where: { followingId: userId },
    select: {
      follower: {
        select: {
          id: true,
          fullName: true,
          profilePicture: true,
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
          profilePicture: true,
        },
      },
    },
  });
};

const followUser = async (userId: string, targetUserId: string) => {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    throw new Error("You are already following this user");
  }

  return prisma.follow.create({
    data: {
      followerId: userId,
      followingId: targetUserId,
    },
  });
};

const unfollowUser = async (userId: string, targetUserId: string) => {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: userId,
        followingId: targetUserId,
      },
    },
  });

  if (!existingFollow) {
    throw new Error("You are not following this user");
  }

  return prisma.follow.delete({
    where: {
      id: existingFollow.id,
    },
  });
};

const getUserProfile = async (targetUserId: string, currentUserId: string) => {
  // user exists কিনা
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePicture: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // followers count
  const followersCount = await prisma.follow.count({
    where: { followingId: targetUserId },
  });

  // following count
  const followingCount = await prisma.follow.count({
    where: { followerId: targetUserId },
  });

  // current user follow করছে কিনা
  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    },
  });

  return {
    user,
    followersCount,
    followingCount,
    isFollowing: Boolean(isFollowing),
  };
};

export const followerServices = {
  getfollowers,
  getfollowing,
  followUser,
  getUserProfile,
  unfollowUser,
};
