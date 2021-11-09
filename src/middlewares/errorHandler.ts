import { NextFunction, Request, Response } from "express";
import { JWAError } from "@jwalab/errors";

export default async function errorHandlingMiddleware(
    error: JWAError | Error,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): Promise<Response> {
    console.error(error);

    if (error instanceof JWAError) {
        const { httpCode, name, message, errorCode } = error;

        return res.status(httpCode).send({
            name,
            message,
            errorCode
        });
    }

    return res.status(500).send({
        name: "UNCATCHED_ERROR",
        errorCode: "UncatchedOrMalformedError",
        message:
            "An unexpected error occurred, our teams have been alerted and will be working on it soon."
    });
}
