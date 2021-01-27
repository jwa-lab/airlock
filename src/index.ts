import {AirlockRequest,AirlockReply} from './airlock_pb'
import grpc, {sendUnaryData} from 'grpc';

const NATS = require('nats');
const nc = NATS.connect();

const PROTO_PATH = __dirname + '/../protos/airlock.proto';
const grpcConst = require('grpc');
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
const protoDescriptor = grpcConst.loadPackageDefinition(packageDefinition);

const airlock = protoDescriptor.airlock;

const server = new grpc.Server();

server.addService(airlock.Airlock.service, {
//    request: function request(call : grpc.ServerUnaryCall<AirlockRequest>, callback : sendUnaryData<AirlockReply>) {
    request: function request(call :any , callback : any) {
//        nc.request(call.request.getEndpoint(), call.request.getPayloadText(), { max: 1, timeout: 1000 }, (msg : any) => {
        nc.request(call.request.endpoint, call.request.payload_text, { max: 1, timeout: 1000 }, (msg : any) => {
            if (msg instanceof NATS.NatsError && msg.code === NATS.REQ_TIMEOUT) {
                callback({
                    code: 500,
                    message: 'Something went wrong',
//                    name: '',
                    status: grpc.status.INTERNAL
                },
                    null);
            } else {
//                const reply : AirlockReply = new AirlockReply();

  //              reply.setResponseText(msg);
                callback(null, {response_text: msg});
            }
        });
    }
});
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
