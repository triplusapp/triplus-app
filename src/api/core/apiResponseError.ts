export class ApiResponseError {
    statusCode: number;
    message: string;
    errors: any[];

    constructor(statusCode: number, message: string, errors: any[]) {
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
    }
}
