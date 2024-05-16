import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'nestjs-prisma';
import { Event } from './entities/event.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  
  async createEvent(createEventDto: CreateEventDto): Promise<{ id: number }>{
    try {
      const event = await this.prisma.events.create({
        data: createEventDto,
      });
  
      return {
        id: event.id,
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async findHostEvents(hostId: number): Promise<Event[]> {
    try {
      const events = await this.prisma.events.findMany({
        where: {
          hosted_by: hostId,
        },
        orderBy: {
          start: 'asc',
        },
      });

      let returnEvents: Event[] = [];
      if (events.length > 0) {
        returnEvents = events.map((event) => plainToClass(Event, event));
      }
  
      return returnEvents;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAttendEvents(attendeeId: number): Promise<Event[]> {
    try {
      const events = await this.prisma.events.findMany({
        where: {
          attendance: {
            some: {
              user_id: attendeeId,
            },
          },
        },
        orderBy: {
          start: 'asc',
        },
      });

      let returnEvents: Event[] = [];
      if (events.length > 0) {
        returnEvents = events.map((event) => plainToClass(Event, event));
      }
  
      return returnEvents;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findHostEvent(id: number, hostId: number): Promise<Event> {
    try {
      const event = await this.prisma.events.findFirst({
        where: {
          id,
          hosted_by: hostId,
        },
      });

      let returnEvent: Event = null;
      if (event) {
        returnEvent = plainToClass(Event, event);
      }
  
      return returnEvent;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAttendEvent(id: number, attendeeId: number): Promise<Event> {
    try {
      const event = await this.prisma.events.findFirst({
        where: {
          id,
          attendance: {
            some: {
              user_id: attendeeId,
            },
          },
        },
      });

      let returnEvent: Event = null;
      if (event) {
        returnEvent = plainToClass(Event, event);
      }
  
      return returnEvent;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.prisma.events.update({
        where: {
          id,
        },
        data: updateEventDto,
      });
  
      let returnEvent: Event = null;
      if (event) {
        returnEvent = plainToClass(Event, event);
      }

      return returnEvent;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.events.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // findAll() {
  //   return `This action returns all events`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} event`;
  // }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} event`;
  // }
}
