const PROTO_PATH = __dirname + "/../protos/airlock.proto";
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

const { SERVER_URL = "localhost:50051" } = process.env;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const airlock = protoDescriptor.airlock;

describe("Given Airlock is running", () => {
    let client;

    beforeAll(() => {
        client = new airlock.Airlock(
            SERVER_URL,
            grpc.credentials.createInsecure()
        );
    });

    describe("When I make a request to an existing service", () => {
        let response;

        beforeEach((done) => {
            client.request(
                {
                    endpoint: "serviceEndpointA",
                    payload_text: "Hi!"
                },
                (err, res) => {
                    response = res;
                    done();
                }
            );
        });

        it("Then returns a valid response", () => {
            expect(response.response_text).toBe("serviceEndpointA is running, got Hi!");
        });
    });

    describe("When I make a request to another existing service", () => {
        let response;

        beforeEach((done) => {
            client.request(
                {
                    endpoint: "serviceEndpointB",
                    payload_text: "Heya!"
                },
                (err, res) => {
                    response = res;
                    done();
                }
            );
        });

        it("Then returns a valid response", () => {
            expect(response.response_text).toBe("serviceEndpointB is running, got Heya!");
        });
    });

    describe("When I make a request to an invalid service", () => {
        let error;

        beforeEach((done) => {
            client.request(
                {
                    endpoint: "invalid",
                    payload_text: "you there?"
                },
                (err) => {
                    error = err;
                    done();
                }
            );
        });

        it("Then returns an error", () => {
            expect(error.code).toBe(500);
            expect(error.details).toBe("Something went wrong");
        });
    });
});
