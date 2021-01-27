// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var airlock_pb = require('./airlock_pb.js');

function serialize_airlock_AirlockReply(arg) {
  if (!(arg instanceof airlock_pb.AirlockReply)) {
    throw new Error('Expected argument of type airlock.AirlockReply');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_airlock_AirlockReply(buffer_arg) {
  return airlock_pb.AirlockReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_airlock_AirlockRequest(arg) {
  if (!(arg instanceof airlock_pb.AirlockRequest)) {
    throw new Error('Expected argument of type airlock.AirlockRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_airlock_AirlockRequest(buffer_arg) {
  return airlock_pb.AirlockRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var AirlockService = exports.AirlockService = {
  request: {
    path: '/airlock.Airlock/Request',
    requestStream: false,
    responseStream: false,
    requestType: airlock_pb.AirlockRequest,
    responseType: airlock_pb.AirlockReply,
    requestSerialize: serialize_airlock_AirlockRequest,
    requestDeserialize: deserialize_airlock_AirlockRequest,
    responseSerialize: serialize_airlock_AirlockReply,
    responseDeserialize: deserialize_airlock_AirlockReply,
  },
};

exports.AirlockClient = grpc.makeGenericClientConstructor(AirlockService);
