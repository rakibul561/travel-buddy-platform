import { Application, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "../config";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Travel Buddy API Docs",
            version: "1.0.0",
            description: "API documentation for the Travel Buddy platform",
            contact: {
                name: "Md Nayeem Miah"
            }
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: `http://localhost:${config.port}/api/v1`,
                description: "Development Server",
            },
        ],
    },
    apis: ["./src/app/modules/**/*.route.ts", "./src/app/modules/**/*.controller.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
    // Swagger Page
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

    // Docs in JSON format
    app.get("/api-docs.json", (req: Request, res: Response) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Docs available at http://localhost:${config.port}/api-docs`);
};
