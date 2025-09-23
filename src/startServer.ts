import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { registry, app } from "./app";
import { config } from "./config";

export function startServer() {
    // Generate the OpenAPI documentation from the fully configured registry
    const generator = new OpenApiGeneratorV3(registry.definitions);
    const openApiDocumentation = generator.generateDocument({
        openapi: "3.0.0",
        info: {
            version: "1.0.0",
            title: "HPC Official Dispatch Service",
        },
        servers: [{ url: "/api/v1" }],
        security: [{ bearerAuth: [] }],
    });

    // Serve the documentation
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(openApiDocumentation),
    );
    console.log("API documentation available at /api-docs");

    // Start listening for requests
    app.listen(config.port, () => {
        console.log(
            `hpc_official_dispatch service is running on port${config.port}`,
        );
    });
}
