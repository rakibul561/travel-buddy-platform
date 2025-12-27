/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/prisma";
import { fileUpload } from "../../utils/fileUpload";
import ApiError from "../../errors/apiError";
import { PrismaQueryBuilder } from "../../utils/QueryBuilder";

/* ================= HELPER ================= */

const generateRandomPassword = async () => {
  return bcrypt.hash(Math.random().toString(36).slice(-10), 10);
};

/* ================= CREATE USER ================= */

const createUser = async (req: Request) => {
  const { name, fullName, email, password, role } = req.body;

  const isExistingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (isExistingUser) {
    throw new ApiError(403, "User already exists!");
  }

  if (!req.file) {
    throw new ApiError(400, "Profile picture is required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const uploadedResult = await fileUpload.uploadToCloudinary(req.file);
  if (!uploadedResult?.secure_url) {
    throw new ApiError(500, "Image upload failed");
  }

  const user = await prisma.user.create({
    data: {
      name,
      fullName,
      email,
      password: hashedPassword,
      role: role ?? "USER",
      authProvider: "LOCAL",
      profilePicture: uploadedResult.secure_url,
      travelInterests: [],
      visitedCountries: [],
      isVerified: false,
    },
  });


  return user;
};

/* ================= GOOGLE LOGIN ================= */

const findOrCreateGoogleUser = async (profile: {
  id: string;
  email: string;
  name: string;
  picture?: string;
}) => {
  let user = await prisma.user.findUnique({
    where: { email: profile.email },
  });

  if (user) {
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          authProvider: "GOOGLE",
          profilePicture: profile.picture ?? user.profilePicture,
          isVerified: true,
        },
      });
    }
    return user;
  }

  const randomPassword = await generateRandomPassword();

  user = await prisma.user.create({
    data: {
      googleId: profile.id,
      email: profile.email,
      name: profile.name,
      fullName: profile.name,
      password: randomPassword,
      profilePicture: profile.picture,
      authProvider: "GOOGLE",
      isVerified: true,
      travelInterests: [],
      visitedCountries: [],
    },
  });

 

  return user;
};

/* ================= GET ALL USERS ================= */

const getAllUsers = async (query: Record<string, any>) => {
  const qb = new PrismaQueryBuilder(query)
    .filter()
    .search(["name", "email"])
    .sort()
    .fields()
    .paginate();

  const prismaQuery = qb.build();

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      ...prismaQuery,
      select: {
        id: true,
        name: true,
        fullName: true,
        email: true,
        role: true,
        profilePicture: true,
        isVerified: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where: prismaQuery.where }),
  ]);

  return {
    meta: qb.getMeta(total),
    data,
  };
};

/* ================= SINGLE USER ================= */

const getSingleUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

/* ================= UPDATE PROFILE ================= */

const userUpdateProfile = async (
  userId: string,
  payload: any,
  file?: Express.Multer.File
) => {
  const { name, fullName, email, oldPassword, newPassword } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updateData: any = {};

  // Basic fields
  if (name) updateData.name = name;
  if (fullName) updateData.fullName = fullName;
  if (email) updateData.email = email;

  // Password change
  if (oldPassword && newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Old password is incorrect");
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  // 🔥 Profile Image Update
  if (file) {
    const uploadedResult = await fileUpload.uploadToCloudinary(file);

    if (!uploadedResult?.secure_url) {
      throw new ApiError(500, "Image upload failed");
    }

    updateData.profilePicture = uploadedResult.secure_url;
  }

  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};



const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};

/* ================= EXPORT ================= */

export const UserService = {
  createUser,
  findOrCreateGoogleUser,
  getAllUsers,
  getSingleUser,
  findUserById,
  userUpdateProfile,
  deleteUser,
};
