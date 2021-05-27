export class ForbiddenRequestError extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "AUTH_INVALID_TOKEN";
        this.statusCode = 403;
    }
}
