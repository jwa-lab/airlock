// package: airlock
// file: airlock.proto

import * as jspb from "google-protobuf";

export class AirlockRequest extends jspb.Message {
  getEndpoint(): string;
  setEndpoint(value: string): void;

  getPayloadText(): string;
  setPayloadText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AirlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AirlockRequest): AirlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AirlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AirlockRequest;
  static deserializeBinaryFromReader(message: AirlockRequest, reader: jspb.BinaryReader): AirlockRequest;
}

export namespace AirlockRequest {
  export type AsObject = {
    endpoint: string,
    payloadText: string,
  }
}

export class AirlockReply extends jspb.Message {
  getResponseText(): string;
  setResponseText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AirlockReply.AsObject;
  static toObject(includeInstance: boolean, msg: AirlockReply): AirlockReply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AirlockReply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AirlockReply;
  static deserializeBinaryFromReader(message: AirlockReply, reader: jspb.BinaryReader): AirlockReply;
}

export namespace AirlockReply {
  export type AsObject = {
    responseText: string,
  }
}

