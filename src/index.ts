import { connect, NatsConnection } from "nats";
import express, { json, urlencoded } from "express";
import cors from "cors";
import restToNatsBridge from "./middlewares/natsToRestBridge";
import serveOpenAPIDocs from "./middlewares/openAPIDocs";
import healthCheck from "./middlewares/healthCheck";
import { HTTP_PORT, NATS_URL, SSO_URI_ORIGIN } from "./config";
import errorHandlingMiddleware from "./middlewares/errorHandler";
import authorizationMiddleware from "./middlewares/authorization";
import { drain, NatsConnectionMonitor } from "./lib/nats/nats";
import cookieParser from "cookie-parser";

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
        const ncMonitor = new NatsConnectionMonitor(natsConnection, () => {
            console.error('[AIRLOCK] nats connection closed');
            process.exit(1);
        });


        const app = express();

        app.use(cookieParser());
        app.use(json());
        app.use(urlencoded({ extended: true }));

        app.get("/docs", cors(), serveOpenAPIDocs(natsConnection));
        app.get("/health-check", healthCheck(ncMonitor));
        app.use(
            "/auth",
            cors({ origin: [SSO_URI_ORIGIN], credentials: true }),
            restToNatsBridge(natsConnection)
        );
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
