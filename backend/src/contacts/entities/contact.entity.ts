import { IsDate, IsEnum, IsInt, IsNotEmpty } from "class-validator";

export class Contact {
    @IsNotEmpty()
    @IsInt()
    id: number;

    @IsNotEmpty()
    @IsInt()
    user_id: number;

    @IsNotEmpty()
    @IsInt()
    contact_id: number;

    @IsNotEmpty()
    @IsDate()
    created_at: Date;

    @IsNotEmpty()
    @IsDate()
    updated_at: Date;
}