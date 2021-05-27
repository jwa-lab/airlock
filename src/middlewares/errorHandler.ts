import { NextFunction, Request, Response } from "express";

interface ResponseErrorInterface extends Error {
    statusCode?: number;
}

interface HTTPResponseErrorInterface {
    name: string;
    message?: string;
}

export default async function errorHandlingMiddleware(
    error: ResponseErrorInterface,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): Promise<Response> {
    let httpResponse = {};

    if (!error?.statusCode) {
        console.error(error);
        return res.status(500).send({
            message: "server error"
        });
    }

    httpResponse = {
        name: error.name,
        message: error?.message
    } as HTTPResponseErrorInterface;

    return res.status(error.statusCode).send(httpResponse);
}
