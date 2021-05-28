const express = require("express");

const DEV_TOKENS = {
    VALID_TOKEN: "TOKEN",
    INVALID_TOKEN: "INVALID_TOKEN"
};

async function init() {
    const app = express();
    const HTTP_PORT = 8001;

    app.use(express.json());

    app.use("/introspect", (req, res, next) => {
        const { method, body } = req;

        if (!body['token']) {
            res.status(400).send({ error: "Invalid body, token is missing.", timestamp: Date.now() });
            return;
        }

        switch (method) {
            case "POST":
                tokenResponse(res, checkToken(body.token));
                break;
            default:
                res.status(405).send({ error: "Invalid method.", timestamp: Date.now() });
                break;
        }

        next();
    });

    app.listen(HTTP_PORT, () => {
        console.log(`[AIRLOCK DEV] Airlock Dev authorization service listening on port ${HTTP_PORT}`);
    });
}

/**
 * @description - Send a response according to the given token.
 *
 * @param res - Response
 * @param status - checkToken status.
 */
function tokenResponse(res, status) {
    switch (status) {
        case true:
            res.status(200).send({ result: true, timestamp: Date.now() });
            break;
        case false:
            res.status(403).send({ error: "Invalid Token", timestamp: Date.now() });
            break;
        default:
            res.status(500).send({ error: "Unexpected error", timestamp: Date.now() });
            break;
    }
}

/**
 * @description - Check the given token.
 *
 * @param token
 * @return {boolean}
 */
function checkToken(token) {
    switch (token) {
        case DEV_TOKENS.VALID_TOKEN:
            return true;
        case DEV_TOKENS.INVALID_TOKEN:
            return false;
        default:
            return false;
    }
}

init();