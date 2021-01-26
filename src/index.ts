import {AirlockReply, AirlockRequest} from "../protos/airlock";
import { Reader, Writer } from "protobufjs/minimal";

const NATS = require('nats');
const nc = NATS.connect();

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

const server = new grpc.Server();

const bytesCall = AirlockRequest.encode({endpoint: '', payloadText: ''}).finish();
const testCall = AirlockRequest.decode(Reader.create(bytesCall));

const bytesCallBack = AirlockReply.encode({responseText : ''}).finish();
const callBack = AirlockReply.decode(Reader.create(bytesCallBack));

server.addService(airlock.Airlock.service, {
    request: function request(call, callback) {
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
