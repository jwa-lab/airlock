const axios = require("axios");

const { SERVER_URL = "http://localhost:8000" } = process.env;

describe("Given Airlock is running", () => {
    describe("When I get the API docs", () => {
        let docs;

        beforeAll(async () => {
            const response = await axios.get(`${SERVER_URL}/docs`);

            docs = response.data;
        });

        it("Then replies with the openApi metadata", () => {
            expect(docs.openapi).toMatch(/3/);
            expect(docs.info.description).toMatch(/PlayTiX/);
        });

        it("Then gathers all the microservices docs", () => {
            expect(Object.keys(docs.paths).sort()).toEqual([
                "/service-a",
                "/service-a/fields",
                "/service-b"
            ]);
        });

        it("Then sets the server url", () => {
            expect(docs.servers.find((server) => {
                return server.url === `${ SERVER_URL }/api`
            }));
        });
    });
});
