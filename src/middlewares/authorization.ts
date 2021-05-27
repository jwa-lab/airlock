import { NextFunction, Request, Response } from "express";
import { AUTH_SERVER } from "../config";
import { ForbiddenRequestError, UnauthorizedRequestError } from "../lib/errors";
import oktaJwtVerifier from "../lib/okta/connect";

export default async function authorizationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { headers } = req;
    const { authorization = "" } = headers;
    const token = authorization.match(/Bearer (.+)/) || undefined;

    if (!token) {
        return next(
            new UnauthorizedRequestError("No authorization token found.")
        );
    }

    try {
        await oktaJwtVerifier.verifyAccessToken(
            token[1],
            `api://${AUTH_SERVER}`
        );
    } catch (err) {
        return next(
            new ForbiddenRequestError(err?.message || "Undefined error.")
        );
    }

    next();
}
