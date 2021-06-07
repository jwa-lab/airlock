import { Request, Response } from "express";
import {
    createInbox,
    Empty,
    JSONCodec,
    NatsConnection,
    Subscription
} from "nats";
import { OpenAPIV3 } from "openapi-types";

import { DOCS_GATHERING_TIMEOUT } from "../config";
import OpenApiBuilder from "../openApi/OpenApiBuilder";

const jc = JSONCodec();

export default function serveOpenAPIDocs(natsConnection: NatsConnection) {
    return async function (req: Request, res: Response): Promise<void> {
        const docsInbox = createInbox();

        const docsPromise = gatherDocs(
            natsConnection.subscribe(docsInbox),
            DOCS_GATHERING_TIMEOUT
        );

        natsConnection.publish("docs", Empty, {
            noMux: true,
            reply: docsInbox
        });

        const docs = await docsPromise;

        res.send(docs);
    };
}

async function gatherDocs(subscription: Subscription, timeout: number) {
    return new Promise((resolve, reject) => {
        (async () => {
            const openApiBuilder = new OpenApiBuilder();

            setTimeout(() => {
                subscription.drain();
                resolve(openApiBuilder.build());
            }, timeout);

            for await (const message of subscription) {
                openApiBuilder.addPaths(
                    (jc.decode(message.data) as OpenAPIV3.Document).paths
                );
            }
        })().catch(reject);
    });
}
