import { Request, Response } from "express";
import { NatsConnectionMonitor } from "../lib/nats/nats";

export default function healthCheck(ncMonitor: NatsConnectionMonitor) {
    return async function (req: Request, res: Response): Promise<void> {
        if (ncMonitor.isConnected()) {
            res.send("ok");
        } else {
            res.status(500).send("ko");
        }
    };
}
