export class NotFoundRequestError extends Error {
    private statusCode: number;

    constructor(message: string) {
        super(message);
        this.name = "AUTH_URL_NOT_FOUND";
        this.statusCode = 404;
    }
}
