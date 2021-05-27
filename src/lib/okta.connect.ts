import OktaJwtVerifier from "@okta/jwt-verifier";

const { OKTA_URI = "playtix.okta.com", OAUTH_SERVER = "default" } = process.env;

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: `https://${OKTA_URI}/oauth2/${OAUTH_SERVER}`
});

export {
    oktaJwtVerifier,
    OAUTH_SERVER
};