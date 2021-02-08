import { connect, JSONCodec } from "nats";
import * as grpc from "grpc";
import * as protoLoader from "@grpc/proto-loader";

const PROTO_PATH = __dirname + "/../protos/airlock.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

// The protoDescriptor object has the full package hierarchy
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const airlock = protoDescriptor.airlock;

const jsonCodec = JSONCodec();

const { NATS_URL = "nats://localhost:4222" } = process.env;

const server = new grpc.Server();

async function init() {
    const natsSubscription = await connect({
        servers: NATS_URL
    });

    server.addService(airlock.Airlock.service, {
        async request(call: any, callback: any) {
            try {
                const response = await natsSubscription.request(
                    call.request.endpoint,
                    encode(call.request.payload_text)
                );

                callback(null, { response_text: decode(response.data) });
            } catch (err) {
                console.error(err, call.request);
                callback({
                    code: 500,
                    message: "Something went wrong",
                    status: grpc.status.INTERNAL
                });
            }
        }
    });

    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
    server.start();
}

init();

function encode(jsonText: string) {
    return jsonCodec.encode(JSON.parse(jsonText));
}

function decode(jsonEncoded: Uint8Array) {
    return JSON.stringify(jsonCodec.decode(jsonEncoded));
}
