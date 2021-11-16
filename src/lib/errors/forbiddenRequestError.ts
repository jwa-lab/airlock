import { JWAError } from "@jwalab/errors";

export class ForbiddenRequestError extends JWAError {
    constructor(message: string, origin?: Error) {
        super(
            403,
            `This endpoint require further authorizations. Details: ${message}`,
            "AUTH_INVALID_TOKEN",
            origin
        );
    }
}
