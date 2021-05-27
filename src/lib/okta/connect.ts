import OktaJwtVerifier, { VerifierOptions } from "@okta/jwt-verifier";
import { AUTH_PROTOCOL, AUTH_URL, AUTH_SERVER, SECURE } from "../../config";

interface OktaJWTInterface extends VerifierOptions {
    testing: {
        disableHttpsCheck: boolean;
    };
}

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: `${AUTH_PROTOCOL}://${AUTH_URL}/oauth2/${AUTH_SERVER}`,
    assertClaims: {
        aud: `api://${AUTH_SERVER}`
    },
    testing: {
        disableHttpsCheck: !SECURE
    }
} as OktaJWTInterface);

export default oktaJwtVerifier;
