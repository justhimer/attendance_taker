import { IsInt, IsOptional } from "class-validator";

export class FilterInvitationDto {
    @IsOptional()
    @IsInt()
    event_id: number;

    @IsOptional()
    @IsInt()
    user_id: number;
}