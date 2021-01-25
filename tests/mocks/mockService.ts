const NATS = require("nats");
const nc = NATS.connect();

nc.subscribe("serviceEndpointA", (req, replyTo) => {
    nc.publish(replyTo, `serviceEndpointA is running, got ${req}`);
});

nc.subscribe("serviceEndpointB", (req, replyTo) => {
    nc.publish(replyTo, `serviceEndpointB is running, got ${req}`);
});
