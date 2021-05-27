import { OAUTH_SERVER, oktaJwtVerifier } from "./okta.connect";
import { NextFunction, Request, Response } from "express";

/**
 * @description - Error type thrown by the middleware in case of failure.
 * @param error -  Error message.
 * @param ts - Timestamp.
 */
interface MiddlewareError {
    error: string,
    ts: number
}

/**
 * @description - Intercept any request coming from a user and check
 *                  the given access token integrity.
 *
 * @param req - Request
 * @param res - Response
 * @param next - Continue
 */
function oktaMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { headers } = req;
    const { authorization } = headers;
    // No authorization header case.
    if (!authorization) {
        res.status(401).send({ error: "No authorization token found.", ts: Date.now() } as MiddlewareError);
        return;
    }

    // Authorization header OK, let's check the given token.
    oktaJwtVerifier.verifyAccessToken(authorization?.split(" ")[1] ?? "", `api://${OAUTH_SERVER}`)
        // The given access token is valid, we can forward the request.
        .then(() => {
            next();
        })
        // The access token is invalid.
        .catch((err) => {
            res.status(403).send({ error: err?.message, ts: Date.now() } as MiddlewareError);
            return;
        });
}

export {
    oktaMiddleware
};