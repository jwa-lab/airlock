import { NatsConnection } from "nats";

export class NatsConnectionMonitor {
    private connected = true;

    constructor(nc: NatsConnection, connectionLostCallback: () => void) {
        this.handleStatus(nc);
        this.handleClosing(nc, connectionLostCallback);
    }

    public isConnected(): boolean {
        return this.connected;
    }

    private async handleStatus(nc: NatsConnection) {
        for await (const status of nc.status()) {
            console.info(
                `[AIRLOCK] nats event : ${status.type} => ${JSON.stringify(
                    status.data
                )}`
            );

            switch (status.type) {
                case "disconnect":
                    this.connected = false;
                    break;
                case "reconnect":
                    this.connected = true;
                    break;
            }
        }
    }

    private handleClosing(
        nc: NatsConnection,
        connectionLostCallback: () => void
    ) {
        nc.closed().finally(() => {
            console.error("[AIRLOCK] nats connection definitely closed");
            connectionLostCallback();
        });
    }
}

export function drain(natsConnection: NatsConnection): Promise<void> {
    if (!natsConnection) {
        console.log(`[AIRLOCK] No Nats connection to drain.`);
        return Promise.resolve();
    }

    console.log(
        `[AIRLOCK] Draining connection to NATS server ${natsConnection.getServer()}`
    );
    return natsConnection.drain();
}
