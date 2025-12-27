import bcrypt from "bcrypt";
import { prisma } from "../prisma/prisma";
import config from "../config";

export const seedAdmin = async () => {

    const existingUser = await prisma.user.findUnique({
        where: {
          email: config.admin.email as string,
        },
      });
    
      if (existingUser) {
        console.log("Admin user already exists");
        return;
      }

    const hashPassword = await bcrypt.hash(config.admin.password as string, 10);

    await prisma.user.create({
        data:  {
            name: "Admin",
            fullName: "Admin User",
            email: config.admin.email as string,
            password: hashPassword,
            role: "ADMIN",
            authProvider: "LOCAL",
            isVerified: true,
          }
      });
      console.log("user create success")
}