import { NextFunction, Request, Response } from "express";
import { errorResponse } from "./responses/error.response";
import { developmentAuthorize } from "./development.authorize";
import { oktaAuthorization } from "./okta.authorize";

/**
 * @description - Authorization middleware to filter invalid requests.
 *
 * @param req
 * @param res
 * @param next
 */
function authorizationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const { headers } = req;
    const { authorization } = headers;
    const argv = process.argv?.slice(2);

    if (!argv) {
        errorResponse(res, 500, "Middleware arguments error.");
        return;
    }

    // No authorization header case, or no access token found.
    if (!authorization?.split(" ")[1]) {
        errorResponse(res, 401, "No authorization token found.");
        return;
    }

    switch (argv[0]) {
        case "--prod":
            oktaAuthorization(res, next, authorization?.split(" ")[1]);
            break;
        default:
            developmentAuthorize(res, next, authorization?.split(" ")[1]);
            break;
    }
}

export {
    authorizationMiddleware
};