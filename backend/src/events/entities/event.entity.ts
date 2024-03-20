import { IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Event {
    @IsNotEmpty()
    @IsInt()
    id: number;
    
    @IsNotEmpty()
    @IsInt()
    hosted_by: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsDateString()
    start: Date;

    @IsNotEmpty()
    @IsDateString()
    end: Date;

    @IsNotEmpty()
    @IsString()
    venue: string;

    @IsOptional()
    @IsString()
    details?: string;

    @IsNotEmpty()
    @IsDate()
    created_at: Date;

    @IsNotEmpty()
    @IsDate()
    updated_at: Date;
}
