import { JWAError } from "@jwalab/errors";

export class NotFoundRequestError extends JWAError {
    constructor(message: string, origin?: Error) {
        super(
            404,
            `URL Not found. Details: ${message}`,
            "URL_NOT_FOUND",
            origin
        );
    }
}
