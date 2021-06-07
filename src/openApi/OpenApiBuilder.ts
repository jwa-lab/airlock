import { OpenAPIV3 } from "openapi-types";

import OpenAPIMetadata from "./OpenApiMetadata.json";

export default class SwaggerBuilder {
    private readonly swagger: OpenAPIV3.Document;

    constructor() {
        this.swagger = JSON.parse(JSON.stringify(OpenAPIMetadata));
    }

    addPaths(paths: OpenAPIV3.PathsObject): void {
        this.swagger.paths = {
            ...this.swagger.paths,
            ...paths
        };
    }

    build(): OpenAPIV3.Document {
        return this.swagger;
    }
}
