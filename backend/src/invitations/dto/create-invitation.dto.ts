import { OmitType } from "@nestjs/mapped-types";
import { Invitation } from "../entities/invitation.entity";

export class CreateInvitationDto extends OmitType(Invitation, [
    'id', 
    'created_at', 
    'updated_at'
]) { }