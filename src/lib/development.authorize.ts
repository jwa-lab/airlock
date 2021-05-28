import { NextFunction, Response } from "express";
import axios from "axios";
import { errorResponse } from "./responses/error.response";

/**
 * @description - Middleware used for development purpose in order to avoid
 *                  the Okta check dependency.
 *
 * @param res - Response
 * @param next - Continue
 * @param authorization - Authorization header.
 */
function developmentAuthorize(res: Response, next: NextFunction, authorization: string): void {
    console.log(authorization)
    axios.post("http://localhost:8001/introspect", {
        token: authorization
    })
        .then(() => {
            next();
        })
        .catch((err) => {
            errorResponse(res, 403, err?.response?.data?.error ?? err?.message);
        });
    return;
}

export {
    developmentAuthorize
};