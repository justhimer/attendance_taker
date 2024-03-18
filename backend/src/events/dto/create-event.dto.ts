import { OmitType } from "@nestjs/mapped-types";
import { Event } from "../entities/event.entity";

export class CreateEventDto extends OmitType(Event, [
    'id', 
    'created_at', 
    'updated_at'
]) { }

export class CreateEventRequestDto extends OmitType(CreateEventDto, [
    'hosted_by'
]) { }
