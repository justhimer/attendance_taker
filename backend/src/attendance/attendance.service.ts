import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { PrismaService } from 'nestjs-prisma';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';
import { plainToClass } from 'class-transformer';
import { Attendance, AttendanceWithEventDetails } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) { }

  // attendance record can only be created when the user accepts the invitation
  // so we don't need to create a separate create method for attendance

  // only the event host or the attendee can view the attendance records
  async findAttendances(viewerId: number, filter?: FilterAttendanceDto): Promise<Attendance[]> {
    try {
      const whereClause: any = {
        OR: [
          {
            event: {
              hosted_by: viewerId,
            },
          },
          {
            user_id: viewerId,
          },
        ],
      };
  
      if (filter) {
        if (filter.event_id) {
          whereClause.event_id = filter.event_id;
        }
  
        if (filter.user_id) {
          whereClause.user_id = filter.user_id;
        }
      }

      const attendanceRecords = await this.prisma.attendance.findMany({
        where: whereClause,
      });

      return attendanceRecords.map(attendance => plainToClass(Attendance, attendance));
    } catch (error) {
      throw new Error(error);
    }
  }

  // only the event host or the attendee can view the attendance records
  // async findAttendEvents(viewerId: number, filter?: FilterAttendanceDto): Promise<Attendance[]> {
  //   try {
  //     const whereClause: any = {
  //       OR: [
  //         {
  //           event: {
  //             hosted_by: viewerId,
  //           },
  //         },
  //         {
  //           user_id: viewerId,
  //         },
  //       ],
  //     };
  
  //     if (filter?.user_id) {
  //       whereClause.user_id = filter.user_id;
  //     }
  
  //     if (filter?.event_id) {
  //       whereClause.event_id = filter.event_id;
  //     }

  //     const attendanceRecords = await this.prisma.attendance.findMany({
  //       where: whereClause,
  //       include: {
  //         event: true,
  //       },
  //       orderBy: {
  //         event: {
  //           start: 'asc'
  //         }
  //       }
  //     });

  //     return attendanceRecords.map(attendance => plainToClass(Attendance, attendance));
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // only the event host or the attendee can view the attendance record
  async findAttendEvent(id: number, viewerId: number): Promise<AttendanceWithEventDetails>{
    try {
      const attendance = await this.prisma.attendance.findFirst({
        where: {
          id,
          OR: [
            {
              event: {
                hosted_by: viewerId,
              },
            },
            {
              user_id: viewerId,
            },
          ],
        },
        include: {
          event: true,
        },
      });
      
      return plainToClass(AttendanceWithEventDetails, attendance);
    } catch (error) {
      throw new Error(error);
    }
  }

  // async findAttendEventByEventID(eventId: number, viewerId: number): Promise<AttendanceWithEventDetails>{
  //   try {
  //     const attendance = await this.prisma.attendance.findFirst({
  //       where: {
  //         event_id: eventId,
  //         OR: [
  //           {
  //             event: {
  //               hosted_by: viewerId,
  //             },
  //           },
  //           {
  //             user_id: viewerId,
  //           },
  //         ],
  //       },
  //       include: {
  //         event: true,
  //       },
  //     });
      
  //     return plainToClass(AttendanceWithEventDetails, attendance);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    try {
      const updatedAttendance = await this.prisma.attendance.update({
        where: { id },
        data: updateAttendanceDto,
      });

      return plainToClass(Attendance, updatedAttendance);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.attendance.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // create(createAttendanceDto: CreateAttendanceDto) {
  //   return 'This action adds a new attendance';
  // }

  // findAll() {
  //   return `This action returns all attendance`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} attendance`;
  // }

  // update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
  //   return `This action updates a #${id} attendance`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} attendance`;
  // }
}
