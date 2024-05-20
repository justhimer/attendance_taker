import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Event } from "../entities/event.entity";

class UpdatableEventDto extends OmitType(Event, [
    'id', 
    'created_at', 
    'updated_at'
]) { }

export class UpdateEventDto extends PartialType(UpdatableEventDto) {}
