/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { sendEmail } from "../../utils/emailSender";
import { fileUpload } from "../../utils/fileUpload";
import { stripe } from "../../utils/stripe";
import { getIO } from "../../utils/socket";
import ApiError from "../../errors/apiError";
import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../prisma/prisma";
import { PrismaQueryBuilder } from "../../utils/QueryBuilder";

const createUser = async (req: Request) => {
    const { password } = req.body;

    const isExistingUser = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })

    if (!password) {
        throw new ApiError(500, "password is required")
    }

    const hashPassword = await bcrypt.hash(password, 10)

    if (isExistingUser) {
        throw new ApiError(403, "User already exists!")
    }

    if (!req.file) {
        throw new ApiError(404, "file is required!");
    }

    const uploadedResult = await fileUpload.uploadToCloudinary(req.file);
    const image_url = uploadedResult?.secure_url;


    const result = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            role: req.body.role ?? "USER",
            profilePicture: image_url,
            authProvider: "LOCAL",
        
        }
    })

    await sendEmail({
        to: req.body.email,
        subject: "Welcome to SMT Project 🎉",
        html: `
      <h2>Hello ${req.body.name}</h2>
      <p>Welcome to our platform.</p>
      <p>Happy coding 🚀</p>
    `,
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        customer_email: req.body.email,

        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `Order #${123}`,
                    },
                    unit_amount: 100 * 100,
                },
                quantity: 1,
            },
        ],

        metadata: {
            orderId: 123,
            userId: result.id,
        },

        success_url:
            `${config.stripe.frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
            `${config.stripe.frontendUrl}/payment/cancel`,
    });


    await sendEmail({
        to: req.body.email,
        subject: "Payment Successful 🎉",
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${req.body.name},</h2>

      <p>✅ Your payment has been <strong>successfully completed</strong>.</p>

      <hr />

      <p><strong>Payment Details:</strong></p>
      <ul>
        <li><strong>Amount Paid:</strong> $${(100).toFixed(2)} USD</li>
        <li><strong>Order ID:</strong> #123</li>
        <li><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</li>
      </ul>

      <hr />

      <p>
        Thank you for choosing <strong>SMT Project</strong>.
        If you have any questions, feel free to contact our support team.
      </p>

      <p>Happy coding 🚀</p>

      <p style="margin-top: 30px;">
        Best regards,<br/>
        <strong>SMT Project Team</strong>
      </p>
    </div>
  `,
    });


    // 🔔 Realtime notify
    const io = getIO();
    io.emit("user-registered", {
        message: "New user registered",
        data: result,
    });

    return { clientSecret: session.url, result }
 
};








// New: Find or create Google user
const findOrCreateGoogleUser = async (profile: {
    id: string;
    email: string;
    name: string;
    picture?: string;
}) => {
    try {
        // Try to find by email first (email is unique, googleId may not be indexed yet)
        let user = await prisma.user.findUnique({
            where: { email: profile.email },
        });

        // If user exists with this email
        if (user) {
            // Check if this is a Google user or existing local user
            if (!user.googleId) {
                // Update existing local user with Google info
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: profile.id,
                        authProvider: "GOOGLE",
                        profilePicture: profile.picture || user.profilePicture,
                        isVerified: true,
                    },
                });
            }
            // User already has Google login, just return
            return user;
        }

        // No user found with this email, create new Google user
        user = await prisma.user.create({
            data: {
                googleId: profile.id,
                email: profile.email,
                name: profile.name,
                profilePicture: profile.picture,
                authProvider: "GOOGLE",
                isVerified: true,
                password: null,
            },
        });

        console.log("google login", user);
        
        

        // Send welcome email
        await sendEmail({
            to: profile.email,
            subject: "Welcome to SMT Project 🎉",
            html: `
          <h2>Hello ${profile.name}</h2>
          <p>Welcome to our platform! You've successfully signed up with Google.</p>
          <p>Happy coding 🚀</p>
        `,
        });

        // 🔔 Realtime notify
        const io = getIO();
        io.emit("user-registered", {
            message: "New user registered via Google",
            data: user,
        });

        return user;
    } catch (error) {
        throw new ApiError(500, `Error in Google authentication: ${error}`);
    }
};

// New: Find user by ID (for passport deserialize)
const findUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        return user;
    } catch (error) {
        throw new ApiError(500, `Error finding user: ${error}`);
    }
};


const getAllUsers = async (query: Record<string, any>) => {
  const qb = new PrismaQueryBuilder(query)
    .filter()
    .search(["name", "email"])
    .sort()
    .fields()
    .paginate();

  const prismaQuery = qb.build();

  const [data, total] = await Promise.all([
    prisma.user.findMany(prismaQuery),
    prisma.user.count({ where: prismaQuery.where }),
  ]);
  return {
    meta: qb.getMeta(total),
    data
  };
};

// New: Get current authenticated user
const getSingleUser = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
    });
};

const userUpdateProfile = async (userId: string, payload: any) => {
  const { name, oldPassword, newPassword, email } = payload;
  

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateData: any = {};

  // update name
  if (name) {
    updateData.name = name;
  }

  if(email) {
    updateData.email = email
  }


  // update password
  if (oldPassword && newPassword) {

  if (!user.password) {
    throw new Error("Password not set for this user");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new Error("Old password is incorrect");
  }

  updateData.password = await bcrypt.hash(newPassword, 10);
}


  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: { id: userId },
  });
};



export const UserService = {
    createUser,
    getAllUsers,
    findOrCreateGoogleUser,
    findUserById,
    getSingleUser,
    userUpdateProfile,
    deleteUser
};