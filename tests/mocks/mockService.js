const { UnknownItemError } = require("../../dist/lib/errors/unknownItemError");

const { connect, JSONCodec } = require("nats");

let jc = JSONCodec();

const items = {};

async function run() {
    const nc = await connect();

    const addItemSub = nc.subscribe("POST:item");
    const getItemSub = nc.subscribe("GET:item.*");
    const errorSub = nc.subscribe("DELETE:item.*");
    const authorizeSub = nc.subscribe("GET:auth");
    const pingSub = nc.subscribe("ping");

    const docsService1 = nc.subscribe("docs");
    const docsService2 = nc.subscribe("docs");

    (async () => {
        for await (const message of authorizeSub) {
            message.respond(
                jc.encode({
                    result: true
                })
            );
        }
    })().then();

    (async () => {
        for await (const message of addItemSub) {
            const data = jc.decode(message.data).body;

            items[data.id] = data;

            message.respond(
                jc.encode({
                    id: data.id
                })
            );
        }
    })().then();

    (async () => {
        for await (const message of docsService1) {
            message.respond(
                jc.encode({
                    paths: {
                        "/service-a": {
                            get: {
                                description: "get thingies from service-a"
                            }
                        },
                        "/service-a/fields": {
                            put: {
                                description: "update thingies in service-a"
                            }
                        }
                    }
                })
            );
        }
    })().then();

    (async () => {
        for await (const message of docsService2) {
            message.respond(
                jc.encode({
                    paths: {
                        "/service-b": {
                            get: {
                                description: "get thingies from service-b"
                            }
                        }
                    }
                })
            );
        }
    })().then();

    (async () => {
        for await (const message of getItemSub) {
            const query = jc.decode(message.data).query;
            const messageSubstrings = String(message.subject).split(".");
            const subjectSubstrings = "GET:item.*".split(".");
            const wildCardposition = subjectSubstrings.findIndex(
                (val) => val === "*"
            );

            const id = messageSubstrings[wildCardposition];

            const item = items[id];

            try {
                if (item) {
                    if (query && query.field) {
                        message.respond(
                            jc.encode({
                                [query.field]: items[id][query.field]
                            })
                        );
                    } else {
                        message.respond(jc.encode(items[id]));
                    }
                } else {
                    throw new UnknownItemError(`Item ID: ${id}.`);
                }
            } catch (e) {
                message.respond(jc.encode({ error: JSON.stringify(e) }));
            }
        }
    })().then();

    (async () => {
        for await (const message of errorSub) {
            throw new Error(`bad server error`);
        }
    })().then();

    (async () => {
        for await (const message of pingSub) {
            console.error("this should be unreachable");
        }
    })().then();
}

run();
