import { JWAError } from "@jwalab/errors";

export class UnauthorizedRequestError extends JWAError {
    constructor(message: string, origin?: Error) {
        super(
            401,
            `This endpoint require an authorization token. Details: ${message}`,
            "AUTH_NOT_AUTHORIZED",
            origin
        );
    }
}
