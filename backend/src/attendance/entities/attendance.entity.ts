import { IsBoolean, IsDate, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Attendance {
    @IsNotEmpty()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsInt()
    user_id: number;

    @IsNotEmpty()
    @IsInt()
    event_id: number;

    @IsNotEmpty()
    @IsDateString()
    attend_time?: Date;

    // @IsOptional()
    // @IsString()
    // late_reason?: string;

    // @IsOptional()
    // @IsString()
    // absent_reason?: string;

    @IsNotEmpty()
    @IsDate()
    created_at: Date;

    @IsNotEmpty()
    @IsDate()
    updated_at: Date;
}

export class AttendanceWithEventDetails extends Attendance {
    event: {
        id: number;
        title: string;
        description: string;
        start: Date;
        end: Date;
        hosted_by: number;
        created_at: Date;
        updated_at: Date;
    }
}