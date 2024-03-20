import { IsOptional, IsInt } from "class-validator";

export class FilterAttendanceDto {
    @IsOptional()
    @IsInt()
    event_id: number;

    @IsOptional()
    @IsInt()
    user_id: number;
}