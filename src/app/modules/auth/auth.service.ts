/* eslint-disable @typescript-eslint/no-unused-vars */
import config from "../../config";
import ApiError from "../../errors/apiError";
import { prisma } from "../../prisma/prisma";

import { jwtHelper } from "../../utils/JwtHelper";
import bcrypt from 'bcrypt'


const login = async (payload: { email: string; password: string }) => {

  // ✅ DO NOT use findUniqueOrThrow in auth
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  // 🔴 User not found
  if (!user || !user.password) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 🔴 Password mismatch
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(401, "Invalid email or password");
  }
  

  // ✅ Access token
  const accessToken = jwtHelper.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.accessToken as string,
    "10d"
  );

  // ✅ Refresh token
  const refreshToken = jwtHelper.generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.refreshToken as string,
    "90d"
  );

  return {
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      refreshToken,
    },
  };
};



export const AuthServices = {
    login
}