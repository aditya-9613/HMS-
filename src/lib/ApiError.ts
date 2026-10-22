export class ApiError extends Error {
    statusCode: number;
    errors: string[];

    constructor(statusCode: number, message = "Something went wrong", errors: string[] = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}