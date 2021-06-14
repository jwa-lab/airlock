import { connect } from "nats";
import express, { json } from "express";
import cors from "cors";

import restToNatsBridge from "./middlewares/natsToRestBridge";
import serveOpenAPIDocs from "./middlewares/openAPIDocs";
import { HTTP_PORT, NATS_URL } from "./config";

async function init() {
    const natsConnection = await connect({
        servers: NATS_URL
    });

    const app = express();

    app.use(json());

    app.get("/docs", cors(), serveOpenAPIDocs(natsConnection));
    app.use("/api", cors(), restToNatsBridge(natsConnection));

    console.info(`[AIRLOCK] Connected to Nats ${natsConnection.getServer()}`);

    app.listen(HTTP_PORT, () => {
        console.log(`[AIRLOCK] Airlock listening on port ${HTTP_PORT}`);
    });
}

init();
