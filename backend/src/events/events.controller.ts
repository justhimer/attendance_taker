import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, CreateEventRequestDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, SuccessHttpStatus } from 'src/utils/api/response';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createEventRequestDto: CreateEventRequestDto) {
    try {
      // check if the start date and end date are valid date strings
      if (new Date(createEventRequestDto.start).toString() === 'Invalid Date' || new Date(createEventRequestDto.end).toString() === 'Invalid Date') {
        throw new HttpException('Invalid date format', HttpStatus.BAD_REQUEST);
      }

      createEventRequestDto.start = new Date(createEventRequestDto.start);
      createEventRequestDto.end = new Date(createEventRequestDto.end);
      
      // check if the start date is before the end date
      if (createEventRequestDto.start >= createEventRequestDto.end) {
        throw new HttpException('Start date must be before end date', HttpStatus.BAD_REQUEST);
      }

      const createEvent = {
        ...createEventRequestDto,
        hosted_by: req.user.id,
      }
  
      const eventData = this.eventsService.create(createEvent);
  
      return new Response(SuccessHttpStatus.CREATED, eventData);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req) {
    try {
      const events = await this.eventsService.findAll(req.user.id);
      return new Response(SuccessHttpStatus.OK, events);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    try {
      const event = await this.eventsService.findOne(+id, req.user.id);
      return new Response(SuccessHttpStatus.OK, event);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Get()
  // findAll() {
  //   return this.eventsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}