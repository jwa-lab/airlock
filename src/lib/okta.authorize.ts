import { OAUTH_SERVER, oktaJwtVerifier } from "./okta.connect";
import { NextFunction, Request, Response } from "express";
import { errorResponse } from "./responses/error.response";

/**
 * @description - Intercept any request coming from a user and check
 *                  the given access token integrity.
 *
 * @param res - Response
 * @param next - Continue
 * @param authorization - Authorization header
 */
function oktaAuthorization(res: Response, next: NextFunction, authorization: string): void {
    // Authorization header OK, let's check the given token.
    oktaJwtVerifier.verifyAccessToken(authorization, `api://${OAUTH_SERVER}`)
        // The given access token is valid, we can forward the request.
        .then(() => {
            next();
        })
        // The access token is invalid.
        .catch((err) => {
            errorResponse(res, 403, err?.message);
            return;
        });
    return
}

export {
    oktaAuthorization
};