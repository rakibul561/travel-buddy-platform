import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma/prisma";

export let io: Server;

export const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:5173"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`🔌 A user connected: ${socket.id}`);

        // Join a specific room (e.g., travelPlanId for trip group chat)
        socket.on("joinTripRoom", (travelPlanId: string) => {
            socket.join(travelPlanId);
            console.log(`User ${socket.id} joined trip room: ${travelPlanId}`);
        });

        // Handle sending message
        socket.on("sendMessage", async (data: { travelPlanId: string; senderId: string; senderName: string; message: string }) => {
            console.log("📨 Message received:", data);

            try {
                // Save to database
                const savedMessage = await prisma.message.create({
                    data: {
                        travelPlanId: data.travelPlanId,
                        senderId: data.senderId,
                        senderName: data.senderName,
                        message: data.message,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                profilePicture: true,
                            },
                        },
                    },
                });

                // Broadcast to everyone in the trip room including the sender
                io.to(data.travelPlanId).emit("receiveMessage", {
                    senderId: savedMessage.senderId,
                    senderName: savedMessage.senderName,
                    message: savedMessage.message,
                    profilePicture: savedMessage.sender.profilePicture,
                    timestamp: savedMessage.createdAt,
                });
            } catch (error) {
                console.error("Failed to save or broadcast message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`🛑 User disconnected: ${socket.id}`);
        });
    });

    return io;
};
