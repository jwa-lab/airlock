const NATS = require('nats');

const PROTO_PATH = __dirname + '/../protos/airlock.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
    
// The protoDescriptor object has the full package hierarchy
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const airlock = protoDescriptor.airlock;

const {
    NATS_URL = "nats://localhost:4222"
} = process.env;

const server = new grpc.Server();
const nc = NATS.connect(NATS_URL);

server.addService(airlock.Airlock.service, {
    request: function request(call: any, callback: any) {
        nc.request(call.request.endpoint, call.request.payload_text, { max: 1, timeout: 1000 }, (msg : any) => {
            if (msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT) {
                callback({
                    code: 500,
                    message: 'Something went wrong',
                    status: grpc.status.INTERNAL
                });
            } else {
                callback(null, {response_text: msg });
            }
        });
    }
});
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
