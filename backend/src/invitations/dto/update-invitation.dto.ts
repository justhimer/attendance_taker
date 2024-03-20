import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { CreateInvitationDto } from './create-invitation.dto';
import { Invitation } from '../entities/invitation.entity';

export class UpdateInvitationDto extends PickType(Invitation, ['status'] as const) {}
