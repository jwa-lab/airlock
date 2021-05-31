import { NextFunction, Request, Response } from "express";

export default async function serveOpenAPIDocs(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const { method, path } = req;

    if (method === "GET" && path === "/docs") {
        // intercepting request and serving documentation instead.
        res.send('HAHA OK');
    } else {
        next();
    }
}