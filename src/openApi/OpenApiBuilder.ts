import { OpenAPIV3 } from "openapi-types";
import { merge } from "lodash";
import { Request } from "express";

import OpenAPIMetadata from "./OpenApiMetadata.json";

export default class SwaggerBuilder {
    private readonly swagger: OpenAPIV3.Document;

    constructor() {
        this.swagger = JSON.parse(JSON.stringify(OpenAPIMetadata));
    }

    setUrl(req: Request): this {
        this.swagger.servers = [
            {
                url: `${req.protocol}://${req.headers.host}/api`,
                description: "Services available via this Airlock"
            }
        ];

        return this;
    }

    addPaths(paths: OpenAPIV3.PathsObject): this {
        merge(this.swagger.paths, paths);

        return this;
    }

    addComponents(components: OpenAPIV3.ComponentsObject): this {
        merge(this.swagger.components, components);

        return this;
    }

    addTags(tags: OpenAPIV3.TagObject[]): this {
        merge(this.swagger.tags, tags);

        return this;
    }

    build(): OpenAPIV3.Document {
        return this.swagger;
    }
}
