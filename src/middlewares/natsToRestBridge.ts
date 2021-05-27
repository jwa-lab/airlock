import { ErrorCode, JSONCodec, NatsConnection } from "nats";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundRequestError } from "../lib/errors";

interface PlatformResponse extends Object {
    error?: string;
}

const jsonCodec = JSONCodec();

export default function restToNatsBridgeFactory(
    natsConnection: NatsConnection
) {
    return async function restToNatsBridge(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { method, path, body, query, originalUrl } = req;
        const subjectName = `${method}:${path
            .substring(1)
            .split("/")
            .join(".")}`;

        console.log(`[AIRLOCK] Request on ${subjectName}`);

        try {
            const reply = await natsConnection.request(
                subjectName,
                jsonCodec.encode({
                    body,
                    query
                }),
                { timeout: 30000 }
            );

            const response = jsonCodec.decode(reply.data) as PlatformResponse;

            if (response?.error) {
                return next(new BadRequestError(response.error));
            } else {
                res.status(200).send(reply.data);
            }
        } catch (err) {
            if (err.code === ErrorCode.NoResponders) {
                return next(
                    new NotFoundRequestError(
                        `No endpoint found at ${method}:${originalUrl}`
                    )
                );
            } else {
                return next(new Error());
            }
        }

        next();
    };
}
