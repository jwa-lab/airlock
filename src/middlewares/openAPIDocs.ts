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
                try {
                    const openApiDoc = jc.decode(message.data) as OpenAPIV3.Document;

                    openApiBuilder
                        .addPaths(openApiDoc.paths)
                        .addComponents(openApiDoc.components || {})
                        .addTags(openApiDoc.tags || []);

                } catch (err) {
                    console.error('[AIRLOCK] Invalid OpenAPIV3 docs received when gathering docs');
                }
            }
        })().catch(reject);
    });
}
