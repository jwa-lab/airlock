import { connect, ErrorCode, JSONCodec } from "nats";
import express, { json } from "express";

const jsonCodec = JSONCodec();

const { NATS_URL = "nats://localhost:4222", HTTP_PORT = 8000 } = process.env;

interface PlatformResponse extends Object {
    error?: string;
}

async function init() {
    const natsConnection = await connect({
        servers: NATS_URL
    });

    const app = express();

    app.use(json());

    app.use(async function restToNatsBridge(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const { method, url, body } = req;
        const topicName = `${method}:${url.substring(1).split("/").join(".")}`;

        console.log(`[AIRLOCK] Request on ${topicName}`);

        try {
            const reply = await natsConnection.request(
                topicName,
                jsonCodec.encode(body),
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
    });

    console.info(`[AIRLOCK] Connected to Nats ${natsConnection.getServer()}`);

    app.listen(HTTP_PORT, () => {
        console.log(`[AIRLOCK] Airlock listening on port ${HTTP_PORT}`);
    });
}

init();
