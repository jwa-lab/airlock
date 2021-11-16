import { JWAError } from "@jwalab/errors";

export class AirlockError extends JWAError {
    constructor(
        name: string,
        httpCode: number,
        message: string,
        errorCode: string
    ) {
        super(httpCode, message, errorCode, undefined);
        this.name = name;
    }
}
