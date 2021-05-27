const axios = require("axios");

const { MOCK_AUTH_SERVICE = "http://localhost:8999" } = process.env;

async function generateTestToken() {
    let token, tokenRequest;

    try {
        tokenRequest = await axios.get(
            MOCK_AUTH_SERVICE + "/oauth2/default/v1/token"
        );
        token = tokenRequest.data.token;
    } catch (error) {
        throw new Error(error?.message || "Unable to fetch a dev token.");
    }

    return token;
}

module.exports = {
    generateTestToken
};
