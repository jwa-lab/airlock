import { JWAError } from "@jwalab/errors";

export class ForbiddenRequestError extends JWAError {
    constructor(message: string, origin?: Error) {
        super(
            403,
            ForbiddenRequestError.name,
            `This endpoint require further authorizations. Details: ${message}`,
            "AUTH_INVALID_TOKEN",
            origin
        );
    }
}
