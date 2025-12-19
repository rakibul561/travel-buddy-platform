import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { UserService } from "../modules/user/user.service";

let io: Server;

export const initSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:3000", "http://localhost:5173"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        /* ===============================
           BASIC MESSAGE TEST (already had)
        =============================== */
        socket.on("message", (data) => {
            try {
                console.log("Message received from socket:", socket.id);
                console.log("Message data:", data);

                socket.emit("message-reply", {
                    message: "Server received your message",
                });
            } catch (error) {
                console.error("Error handling message:", error);
                socket.emit("error", { message: "Failed to process message" });
            }
        });

        // 🔥 Load users via service
        socket.on("get-users", async () => {
            try {
                console.log("📥 get-users received:", socket.id);

                const users = await UserService.getUsers();

                socket.emit("users-response", {
                    success: true,
                    data: users,
                });
            } catch (error) {
                console.error("❌ get-users error:", error);

                socket.emit("users-response", {
                    success: false,
                    message: "Failed to load users",
                });
            }
        });


        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
