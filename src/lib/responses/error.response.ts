import { Response } from "express";

/**
 * @description - Generic error interface
 */
interface ErrorInterface {
    error: string,
    statusCode: number,
    timestamp: number
}

/**
 * @description - Generic error response.
 *
 * @param res - Response
 * @param statusCode - HTTP error code
 * @param message - Error message
 */
function errorResponse(res: Response, statusCode: number, message: string): void {
    const errorMessage = {
        error: message,
        statusCode: statusCode,
        timestamp: Date.now()
    } as ErrorInterface;

    res.status(statusCode)
        .send(errorMessage);
}

export {
    errorResponse
};