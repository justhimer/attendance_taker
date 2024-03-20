import { HttpException, HttpStatus } from "@nestjs/common";

export enum SuccessHttpStatus {
    OK = HttpStatus.OK,
    CREATED = HttpStatus.CREATED,
    ACCEPTED = HttpStatus.ACCEPTED,
}

export class Response {
    statusCode: SuccessHttpStatus;
    data: any;
    // messages?: string[];

    constructor(
        statusCode: SuccessHttpStatus,
        data: any = null,
        // messages?: string[]
    ) {
        this.statusCode = statusCode;
        this.data = data;
        // this.messages = messages;
    }
}