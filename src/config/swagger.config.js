import path, { dirname } from "path";
import { fileURLToPath } from "url";

import swaggerJsdoc from "swagger-jsdoc";

import { AppConfig } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "Express Server with socket.io",
    description: "Internal API documentation",
    version: "1.0.0",
    contact: {
      name: "Vivek Sahani",
      email: "viveksahani39266@gmail.com"
    }
  },
  servers: [
    {
      url: `http://localhost:${AppConfig.PORT}/api/v1`,
      description: "Local dev server"
    }
  ],
  tags: [
    {
      name: "Authentication",
      description: "Authentication related operations"
    }
  ]
};

const swaggerSpecs = swaggerJsdoc({
  swaggerDefinition: swaggerDef,
  apis: [
    path.join(__dirname, "../../docs/**/*.{yaml,yml}"),
    path.join(__dirname, "../routes/**/*.routes.js")
  ]
});

export { swaggerSpecs };
