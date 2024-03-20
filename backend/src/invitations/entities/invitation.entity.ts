import { IsDate, IsEnum, IsInt, IsNotEmpty } from "class-validator";

export enum AcceptanceStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

export class Invitation {
    @IsNotEmpty()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsInt()
    event_id: number;

    @IsNotEmpty()
    @IsInt()
    user_id: number;

    @IsNotEmpty()
    @IsEnum(AcceptanceStatus)
    status: AcceptanceStatus;

    @IsNotEmpty()
    @IsDate()
    created_at: Date;

    @IsNotEmpty()
    @IsDate()
    updated_at: Date;
}

export class InvitationWithEventDetails extends Invitation {
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