import { IsEnum, IsInt, IsOptional } from "class-validator";
import { AcceptanceStatus } from "../entities/invitation.entity";

export class FilterInvitationDto {
    @IsOptional()
    @IsInt()
    event_id: number;

    @IsOptional()
    @IsInt()
    user_id: number;

    @IsOptional()
    @IsEnum(AcceptanceStatus)
    status: AcceptanceStatus;
}