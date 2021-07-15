import { connect, NatsConnection } from "nats";
import express, { json } from "express";
import cors from "cors";
import restToNatsBridge from "./middlewares/natsToRestBridge";
import serveOpenAPIDocs from "./middlewares/openAPIDocs";
import { HTTP_PORT, NATS_URL } from "./config";
import errorHandlingMiddleware from "./middlewares/errorHandler";
import authorizationMiddleware from "./middlewares/authorization";
import { drain } from "./lib/nats/nats";

let natsConnection: NatsConnection;

async function init() {
    async function shutdown(exitCode: number): Promise<void> {
        try {
            await drain(natsConnection);
            process.exit(exitCode);
        } catch (e) {
            console.error(
                "[AIRLOCK] Unable to drain Nats connection, shutting down . . ."
            );
        } finally {
            process.exit(1);
        }
    }

    try {
        natsConnection = await connect({
            servers: NATS_URL
        });

        const app = express();

        app.use(json());

        app.get("/docs", cors(), serveOpenAPIDocs(natsConnection));
        app.use("/", cors(), authorizationMiddleware);
        app.use("/api", cors(), restToNatsBridge(natsConnection));
        app.use(errorHandlingMiddleware);

        console.info(
            `[AIRLOCK] Connected to Nats ${natsConnection.getServer()}`
        );

        app.listen(HTTP_PORT, () => {
            console.log(`[AIRLOCK] Airlock listening on port ${HTTP_PORT}`);
        });

        process.on("SIGINT", () => {
            console.log("[AIRLOCK] Gracefully shutting down...");
            shutdown(0);
        });

        process.on("SIGTERM", () => {
            console.log("[AIRLOCK] Gracefully shutting down...");
            shutdown(0);
        });
    } catch (error) {
        console.error(`[AIRLOCK] Airlock exited with error: ${error}`);
        console.error(error);
        shutdown(1);
    }
}

init();
