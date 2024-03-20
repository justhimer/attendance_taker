import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';

export class UpdateAttendanceDto extends PartialType(OmitType(CreateAttendanceDto, ['event_id', 'user_id'])) { }
