/* eslint-disable */
//// https://github.com/stephenh/ts-proto

import { Reader, Writer } from "protobufjs/minimal";

export const protobufPackage = "airlock";

export interface AirlockRequest {
    endpoint: string;
    payloadText: string;
}

export interface AirlockReply {
    responseText: string;
}

const baseAirlockRequest: object = { endpoint: "", payloadText: "" };

export const AirlockRequest = {
    encode(message: AirlockRequest, writer: Writer = Writer.create()): Writer {
        writer.uint32(10).string(message.endpoint);
        writer.uint32(18).string(message.payloadText);
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): AirlockRequest {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseAirlockRequest } as AirlockRequest;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.endpoint = reader.string();
                    break;
                case 2:
                    message.payloadText = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): AirlockRequest {
        const message = { ...baseAirlockRequest } as AirlockRequest;
        if (object.endpoint !== undefined && object.endpoint !== null) {
            message.endpoint = String(object.endpoint);
        } else {
            message.endpoint = "";
        }
        if (object.payloadText !== undefined && object.payloadText !== null) {
            message.payloadText = String(object.payloadText);
        } else {
            message.payloadText = "";
        }
        return message;
    },

    fromPartial(object: DeepPartial<AirlockRequest>): AirlockRequest {
        const message = { ...baseAirlockRequest } as AirlockRequest;
        if (object.endpoint !== undefined && object.endpoint !== null) {
            message.endpoint = object.endpoint;
        } else {
            message.endpoint = "";
        }
        if (object.payloadText !== undefined && object.payloadText !== null) {
            message.payloadText = object.payloadText;
        } else {
            message.payloadText = "";
        }
        return message;
    },

    toJSON(message: AirlockRequest): unknown {
        const obj: any = {};
        message.endpoint !== undefined && (obj.endpoint = message.endpoint);
        message.payloadText !== undefined &&
            (obj.payloadText = message.payloadText);
        return obj;
    }
};

const baseAirlockReply: object = { responseText: "" };

export const AirlockReply = {
    encode(message: AirlockReply, writer: Writer = Writer.create()): Writer {
        writer.uint32(10).string(message.responseText);
        return writer;
    },

    decode(input: Reader | Uint8Array, length?: number): AirlockReply {
        const reader = input instanceof Uint8Array ? new Reader(input) : input;
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = { ...baseAirlockReply } as AirlockReply;
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.responseText = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },

    fromJSON(object: any): AirlockReply {
        const message = { ...baseAirlockReply } as AirlockReply;
        if (object.responseText !== undefined && object.responseText !== null) {
            message.responseText = String(object.responseText);
        } else {
            message.responseText = "";
        }
        return message;
    },

    fromPartial(object: DeepPartial<AirlockReply>): AirlockReply {
        const message = { ...baseAirlockReply } as AirlockReply;
        if (object.responseText !== undefined && object.responseText !== null) {
            message.responseText = object.responseText;
        } else {
            message.responseText = "";
        }
        return message;
    },

    toJSON(message: AirlockReply): unknown {
        const obj: any = {};
        message.responseText !== undefined &&
            (obj.responseText = message.responseText);
        return obj;
    }
};

export interface Airlock {
    Request(request: AirlockRequest): Promise<AirlockReply>;
}

export class AirlockClientImpl implements Airlock {
    private readonly rpc: Rpc;
    constructor(rpc: Rpc) {
        this.rpc = rpc;
    }
    Request(request: AirlockRequest): Promise<AirlockReply> {
        const data = AirlockRequest.encode(request).finish();
        const promise = this.rpc.request(
            "airlock.Airlock",
            "methodDesc.name",
            data
        );
        return promise.then((data) => AirlockReply.decode(new Reader(data)));
    }
}

interface Rpc {
    request(
        service: string,
        method: string,
        data: Uint8Array
    ): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | undefined;
export type DeepPartial<T> = T extends Builtin
    ? T
    : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T extends {}
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : Partial<T>;
