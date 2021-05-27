export class BadRequestError extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "AUTH_BAD_REQUEST";
        this.statusCode = 400;
    }
}
