import { OmitType } from "@nestjs/mapped-types";
import { Attendance } from "../entities/attendance.entity";

export class CreateAttendanceDto extends OmitType(Attendance, [
    'id',
    'created_at', 
    'updated_at'
]) { }
