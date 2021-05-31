import { connect } from "nats";
import express, { json } from "express";

import restToNatsBridge from "./natsToRestBridge";
import serveOpenAPIDocs from "./openAPIDocs";

const { NATS_URL = "nats://localhost:4222", HTTP_PORT = 8000 } = process.env;

async function init() {
    const natsConnection = await connect({
        servers: NATS_URL
    });

    const app = express();

    app.use(json());

    app.use(serveOpenAPIDocs);
    app.use(restToNatsBridge(natsConnection));

    console.info(`[AIRLOCK] Connected to Nats ${natsConnection.getServer()}`);

    app.listen(HTTP_PORT, () => {
        console.log(`[AIRLOCK] Airlock listening on port ${HTTP_PORT}`);
    });
}

init();
