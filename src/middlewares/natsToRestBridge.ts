import { ErrorCode, JSONCodec, NatsConnection } from "nats";
import { NextFunction, Request, Response } from "express";

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
        const { method, path, body, query } = req;
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

            if (response.error) {
                res.status(400).send({
                    message: response.error
                });
            } else {
                res.status(200).send(reply.data);
            }
        } catch (err) {
            if (err.code === ErrorCode.NoResponders) {
                res.status(404).send();
            } else {
                console.error(err);
                res.status(500).send();
            }
        }

        next();
    };
}
