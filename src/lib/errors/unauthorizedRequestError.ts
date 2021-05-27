export class UnauthorizedRequestError extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "AUTH_NOT_AUTHORIZED";
        this.statusCode = 401;
    }
}
