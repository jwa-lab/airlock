const { connect, JSONCodec } = require("nats");

let jc = JSONCodec();

async function run() {
    const nc = await connect();

    const subscription = nc.subscribe("service");

    for await (const message of subscription) {
        message.respond(
            jc.encode({
                endpoint: "service",
                got: jc.decode(message.data)
            })
        );
    }
}

run();
