
import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE FIRST LINE


import http, { Server } from "http";
import app from "./app";
import config from "./app/config";
import { initSocket } from "./app/utils/socket";
import { connectRedis } from "./app/config/redis.config";
import { prisma } from "./app/prisma/prisma";


 async function connectDb() {
  try {
    await prisma.$connect();
    console.log("*** Database connected successfully!!");
  } catch (error) {
    console.log("*** Database connection failed!!", error);
    process.exit(1);
  }
}

async function bootstrap() {
    let server: Server;
    try {
        await connectRedis()
        await connectDb()
        server = http.createServer(app);
        // * Initialize Socket.IO
        initSocket(server);

        server.listen(config.port, () => {
            console.log(`🚀 Server is running on http://localhost:${config.port}`);
        });

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    console.log("Server closed gracefully.");
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        process.on("unhandledRejection", (error) => {
            console.log("Unhandled Rejection detected, shutting down...");
            console.error(error);
            exitHandler();
        });

        process.on("SIGTERM", exitHandler);
        process.on("SIGINT", exitHandler);

    } catch (error) {
        console.error("Error during server startup:", error);
        process.exit(1);
    }
}

bootstrap();
