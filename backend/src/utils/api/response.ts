import { HttpException, HttpStatus } from "@nestjs/common";

export class Response {
    statusCode: HttpStatus;
    data: any;
}