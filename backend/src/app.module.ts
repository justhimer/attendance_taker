import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// import { PrismaModule } from 'nestjs-prisma';
import { EventsModule } from './events/events.module';
import { AttendanceModule } from './attendance/attendance.module';
import { InvitationsModule } from './invitations/invitations.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [
    // PrismaModule.forRoot(),
    UsersModule, 
    AuthModule, EventsModule, AttendanceModule, InvitationsModule, ContactsModule
  ], // forRoot() : global use
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
