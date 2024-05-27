import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, Logger, Request, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, SuccessHttpStatus } from 'src/utils/api/Response';
import { FilterAttendanceDto } from './dto/filter-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllAttendance(@Request() req, @Query('event_id') event_id: string, @Query('user_id') user_id: string) {
    try {
      const filter: FilterAttendanceDto = {
        event_id: event_id ? +event_id : undefined,
        user_id: user_id ? +user_id : undefined,
      };
      
      const attendanceRecords = await this.attendanceService.findAllAttendance(req.user.id, filter);

      if (attendanceRecords.length === 0) {
        throw new HttpException('No attendance records found.', HttpStatus.NOT_FOUND);
      }

      return new Response(SuccessHttpStatus.OK, attendanceRecords);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('events')
  // async findAttendEvents(@Request() req, @Body() filter?: any) {
  //   try {
  //     const attendanceRecords = await this.attendanceService.findAttendEvents(req.user.id, filter);

  //     if (attendanceRecords.length === 0) {
  //       throw new HttpException('No attendance records found.', HttpStatus.NOT_FOUND);
  //     }

  //     return new Response(SuccessHttpStatus.OK, attendanceRecords);
  //   } catch (error) {
  //     Logger.error(error.message);
  //     throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findSingleAttendance(@Request() req, @Param('id') id: string) {
    try {
      const attendanceRecord = await this.attendanceService.findSingleAttendance(+id, req.user.id);

      if (!attendanceRecord) {
        throw new HttpException('Attendance record not found.', HttpStatus.NOT_FOUND);
      }

      return new Response(SuccessHttpStatus.OK, attendanceRecord);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('event/:id')
  // async findAttendEventByEventID(@Request() req, @Param('id') event_id: string) {
  //   try {
  //     const attendanceRecord = await this.attendanceService.findAttendEventByEventID(+event_id, req.user.id);

  //     if (!attendanceRecord) {
  //       throw new HttpException('Attendance record not found.', HttpStatus.NOT_FOUND);
  //     }

  //     return new Response(SuccessHttpStatus.OK, attendanceRecord);
  //   } catch (error) {
  //     Logger.error(error.message);
  //     throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    try {
      // if updateAttendanceDto is empty, throw an error
      if (Object.keys(updateAttendanceDto).length === 0) {
        throw new HttpException('No data provided for update.', HttpStatus.BAD_REQUEST);
      }

      const attendanceRecord = await this.attendanceService.findSingleAttendance(+id, req.user.id);

      if (!attendanceRecord) {
        throw new HttpException('Attendance record not found.', HttpStatus.NOT_FOUND);
      }

      // only the event host or the attendee can update the attendance record
      if (attendanceRecord.event.hosted_by !== req.user.id && attendanceRecord.user_id !== req.user.id) {
        throw new HttpException('You are not authorized to update the attendance record.', HttpStatus.UNAUTHORIZED);
      }

      // if the user is not the event host, there are some restrictions
      if (attendanceRecord.event.hosted_by !== req.user.id) {
        // if current time is later than the event end time, user cannot set the attend_time
        if (updateAttendanceDto.attend_time && new Date(updateAttendanceDto.attend_time) > attendanceRecord.event.end) {
          throw new HttpException('You cannot attend after the event end time.', HttpStatus.BAD_REQUEST);
        }

        // user cannot attend before 3 hours of the event start time
        if (updateAttendanceDto.attend_time && new Date(updateAttendanceDto.attend_time) < new Date(attendanceRecord.event.start.getTime() - 3* 60 * 60 * 1000)) {
          throw new HttpException('You cannot attend before 3 hours of the event start time.', HttpStatus.BAD_REQUEST);
        }

        // // if user attend on time, user cannot set the late_reason and absent_reason
        // if (updateAttendanceDto.attend_time && new Date(updateAttendanceDto.attend_time) <= attendanceRecord.event.start) {
        //   if (updateAttendanceDto.late_reason || updateAttendanceDto.absent_reason) {
        //     throw new HttpException('You cannot set late_reason or absent_reason if you attend on time.', HttpStatus.BAD_REQUEST);
        //   }
        // }
      }

      const updatedAttendanceRecord = await this.attendanceService.update(+id, updateAttendanceDto);

      return new Response(SuccessHttpStatus.OK, updatedAttendanceRecord);
    }
    catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    try {
      const attendanceRecord = await this.attendanceService.findSingleAttendance(+id, req.user.id);

      if (!attendanceRecord) {
        throw new HttpException('Attendance record not found.', HttpStatus.NOT_FOUND);
      }

      // only the event host can delete the attendance record
      if (attendanceRecord.event.hosted_by !== req.user.id) {
        throw new HttpException('You are not authorized to delete the attendance record.', HttpStatus.UNAUTHORIZED);
      }

      await this.attendanceService.remove(+id);

      return new Response(SuccessHttpStatus.OK, `Attendance record with id ${id} has been deleted.`);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
