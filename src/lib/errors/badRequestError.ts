import { JWAError } from "@jwalab/errors";

export class BadRequestError extends JWAError {
    constructor(message: string, origin?: Error) {
        super(
            400,
            BadRequestError.name,
            `Invalid payload. Details: ${message}`,
            "BAD_REQUEST",
            origin
        );
    }
}
