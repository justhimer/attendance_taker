import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService, PrismaService, UsersService],
})
export class ContactsModule {}
