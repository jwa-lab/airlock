const {
    AUTH_SERVER = "default",
    AUTH_PROTOCOL = "",
    AUTH_URL = "",
    SECURE = "true",
    NATS_URL = "nats://localhost:4222",
    HTTP_PORT = 8000,
    DOCS_GATHERING_TIMEOUT = 50
} = process.env;

const NUM_HTTP_PORT = Number(HTTP_PORT);
const NUM_DOCS_GATHERING_TIMEOUT = Number(DOCS_GATHERING_TIMEOUT);
const BOOL_SECURE = SECURE === "true";

if (!AUTH_SERVER) {
    throw new Error(
        `Please provide a valid authorization server via AUTH_SERVER. For instance, use default`
    );
}

if (!AUTH_PROTOCOL) {
    throw new Error(
        `Please provide a valid protocol to use via AUTH_PROTOCOL. For instance, use https`
    );
}

if (!AUTH_URL) {
    throw new Error(
        `Please provide a valid authorization server url to use via AUTH_URL. For instance, localhost:8001`
    );
}

if (!BOOL_SECURE) {
    console.warn(
        "========================================================================================================",
        "\n/!\\ AIRLOCK IS RUNNING IN INSECURE MODE, PLEASE USE THIS CONFIGURATION ONLY FOR DEVELOPMENT PURPOSES /!\\",
        "\n========================================================================================================"
    );
}

if (!NATS_URL) {
    throw new Error(
        `Please provide a valid NATS url via NATS_URL. For instance, nats://nats:4222`
    );
}

if (!HTTP_PORT) {
    throw new Error(
        `Please provide a valid HTTP port for Airlock via HTTP_PORT.`
    );
}

export {
    AUTH_SERVER,
    AUTH_PROTOCOL,
    AUTH_URL,
    BOOL_SECURE as SECURE,
    NATS_URL,
    NUM_HTTP_PORT as HTTP_PORT,
    NUM_DOCS_GATHERING_TIMEOUT as DOCS_GATHERING_TIMEOUT
};
