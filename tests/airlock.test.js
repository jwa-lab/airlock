const axios = require("axios");

const { SERVER_URL = "http://localhost:8000" } = process.env;

describe("Given Airlock is running", () => {
    describe("When I add an item to the mock service using a POST request", () => {
        let data;

        beforeAll(async () => {
            const response = await axios.post(`${SERVER_URL}/item`, {
                id: 1,
                name: "KB9"
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
                const response = await axios.get(`${SERVER_URL}/item/1`);

                data = response.data;
            });

            it("Then returns the original item", () => {
                expect(data).toEqual({
                    id: 1,
                    name: "KB9"
                });
            });
        });

        describe("When I retrieve an item that doesn't exist", () => {
            it("Then throws a client error (400)", async () => {
                try {
                    await axios.get(`${SERVER_URL}/item/2`);

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
                    await axios.get(`${SERVER_URL}/ping`);

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
                try {
                    await axios.delete(`${SERVER_URL}/item/1`);

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
