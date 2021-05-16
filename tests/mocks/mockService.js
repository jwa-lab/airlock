const { connect, JSONCodec } = require("nats");

let jc = JSONCodec();

const items = {};

async function run() {
    const nc = await connect();

    const addItemSub = nc.subscribe("POST:item");
    const getItemSub = nc.subscribe("GET:item.*");
    const errorSub = nc.subscribe("DELETE:item.*");
    const pingSub = nc.subscribe("ping");

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
        for await (const message of getItemSub) {
            const query = jc.decode(message.data).query;
            const messageSubstrings = String(message.subject).split(".");
            const subjectSubstrings = "GET:item.*".split(".");
            const wildCardposition = subjectSubstrings.findIndex(
                (val) => val === "*"
            );

            const id = messageSubstrings[wildCardposition];

            const item = items[id];

            if (item) {
                if (query && query.field) {
                    message.respond(jc.encode({
                        [query.field]: items[id][query.field]
                    }));
                } else {
                    message.respond(jc.encode(items[id]));
                }
            } else {
                message.respond(jc.encode({ error: "Item doesn't exist" }));
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
