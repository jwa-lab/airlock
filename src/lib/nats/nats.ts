import { NatsConnection } from "nats";

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
