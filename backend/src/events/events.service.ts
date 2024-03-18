import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) { }
  
  async create(createEventDto: CreateEventDto) {
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

  async findAll(userId: number) {
    try {
      const events = await this.prisma.events.findMany({
        where: {
          hosted_by: userId,
        },
      });
  
      return events;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const event = await this.prisma.events.findFirst({
        where: {
          id,
          hosted_by: userId,
        },
      });
  
      return event;
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
