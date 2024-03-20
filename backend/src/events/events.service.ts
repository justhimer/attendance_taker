import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'nestjs-prisma';
import { Event } from './entities/event.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  
  async create(createEventDto: CreateEventDto): Promise<{ id: number }>{
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

  async findAll(userId: number): Promise<Event[]> {
    try {
      const events = await this.prisma.events.findMany({
        where: {
          hosted_by: userId,
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

  async findOne(id: number, userId: number): Promise<Event> {
    try {
      const event = await this.prisma.events.findFirst({
        where: {
          id,
          hosted_by: userId,
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
