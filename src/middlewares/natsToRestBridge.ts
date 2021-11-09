import {
    ErrorCode,
    JSONCodec,
    NatsConnection,
    headers as natsHeaders
} from "nats";
import { NextFunction, Request, Response } from "express";
import { NotFoundRequestError } from "../lib/errors";
import { JWAError } from "@jwalab/errors";

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
        const { method, path, body, query, originalUrl, headers } = req;
        const subjectName = `${method}:${path
            .substring(1)
            .split("/")
            .join(".")}`;
        const natsRequestHeaders = natsHeaders();

        console.log(`[AIRLOCK] Request on ${subjectName}`);

        try {
            if (headers?.authorization) {
                natsRequestHeaders.append(
                    "authorization",
                    headers.authorization
                );
            }
            if (headers?.cookie) {
                natsRequestHeaders.append("cookie", headers.cookie);
            }

            const reply = await natsConnection.request(
                subjectName,
                jsonCodec.encode({
                    body,
                    query: query || {}
                }),
                { timeout: 30000, headers: natsRequestHeaders }
            );
            const response = jsonCodec.decode(reply.data) as PlatformResponse;

            if (response?.error) {
                try {
                    const { httpCode, name, message, errorCode } = JSON.parse(
                        response.error
                    );

                    return next(
                        new JWAError(httpCode, name, message, errorCode)
                    );
                } catch (error) {
                    return next(new Error(response.error));
                }
            }

            if (reply?.headers?.get("set-cookie")) {
                res.set(
                    "set-cookie",
                    JSON.parse(reply.headers.get("set-cookie")).cookies
                );
            }

            res.status(200).send(response);
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
    };
}
