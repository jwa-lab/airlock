const axios = require("axios");

const {
    SERVER_URL = "http://localhost:8000",
    DEFAULT_TEST_TOKEN = "TOKEN",
    DEFAULT_INVALID_TEST_TOKEN = "INVALID_TOKEN",
} = process.env;

describe("Given Airlock is running", () => {
    describe("When I try to access to the mock service with no token", () => {
        it("Then replies with a status code 401", async () => {
            try {
                await axios.get(`${SERVER_URL}/auth`);

                throw new Error(
                    "Should fail with a 401 error for client request errors"
                );
            } catch (err) {
                expect(err.response.status).toEqual(401);
            }
        });
    });

    describe("When I try to access to the mock service with a valid token", () => {
        it("Then replies with a status code 200", async () => {
            let req;

            req = await axios.get(`${SERVER_URL}/auth`, {
                headers: {
                    Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                }
            });

            expect(req.status).toEqual(200);
        });
    });

    describe("When I try to access to the mock service with an invalid token", () => {
        it("Then replies with a status code 403", async () => {
            try {
                await axios.get(`${SERVER_URL}/auth`, {
                    headers: {
                        Authorization: ["Bearer", DEFAULT_INVALID_TEST_TOKEN].join(" ")
                    }
                });

                throw new Error(
                    "Should fail with a 403 error for client request errors"
                );
            } catch (err) {
                expect(err.response.status).toEqual(403);
            }
        });
    });

    describe("When I add an item to the mock service using a POST request", () => {
        let data;

        beforeAll(async () => {
            const response = await axios.post(`${SERVER_URL}/item`, {
                id: 1,
                name: "KB9"
            }, {
                headers: {
                    Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                }
            });

            data = response.data;
        });

        it("Then replies with the item id", () => {
            expect(data).toEqual({
                id: 1
            });
        });

        describe("When I retrieve the item", () => {
            beforeAll(async () => {
                const response = await axios.get(`${SERVER_URL}/item/1`, {
                    headers: {
                        Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                    }
                });

                data = response.data;
            });

            it("Then returns the original item", () => {
                expect(data).toEqual({
                    id: 1,
                    name: "KB9"
                });
            });
        });

        describe("When I retrieve an item with a query", () => {
            beforeAll(async () => {
                const response = await axios.get(`${SERVER_URL}/item/1?field=name`, {
                    headers: {
                        Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                    }
                });

                data = response.data;
            });

            it("Then returns the required field for the item", () => {
                expect(data).toEqual({
                    name: "KB9"
                });
            });
        });

        describe("When I retrieve an item that doesn't exist", () => {
            it("Then throws a client error (400)", async () => {
                try {
                    await axios.get(`${SERVER_URL}/item/2`, {
                        headers: {
                            Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                        }
                    });

                    throw new Error(
                        "should fail with a 400 error for client request errors"
                    );
                } catch (err) {
                    expect(err.response.data).toEqual({
                        message: "Item doesn't exist"
                    });

                    expect(err.response.status).toEqual(400);
                }
            });
        });

        describe("When I call an api that doesn't exist", () => {
            it("Then throws throws a url not found error (404)", async () => {
                try {
                    await axios.get(`${SERVER_URL}/ping`, {
                        headers: {
                            Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                        }
                    });

                    throw new Error(
                        "should fail with a 404 error for client request errors"
                    );
                } catch (err) {
                    expect(err.response.status).toEqual(404);
                }
            });
        });

        // Put this test last, it will crash the server
        describe("When I call an api that fails to execute its service", () => {
            it("Then throws throws a server error (500)", async () => {
                jest.setTimeout(40000);

                try {
                    await axios.delete(`${SERVER_URL}/item/1`, {
                        headers: {
                            Authorization: ["Bearer", DEFAULT_TEST_TOKEN].join(" ")
                        }
                    });

                    throw new Error(
                        "should fail with a 500 error for client request errors"
                    );
                } catch (err) {
                    expect(err.response.status).toEqual(500);
                }
            });
        });
    });
});
