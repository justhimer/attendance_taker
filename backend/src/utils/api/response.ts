import { HttpException, HttpStatus } from "@nestjs/common";

export enum SuccessHttpStatus {
    OK = HttpStatus.OK,
    CREATED = HttpStatus.CREATED,
    ACCEPTED = HttpStatus.ACCEPTED,
}

export class Response {
    statusCode: SuccessHttpStatus;
    data: any;

    constructor(
        statusCode: SuccessHttpStatus,
        data: any = null,
    ) {
        this.statusCode = statusCode;
        this.data = data;
    }
}