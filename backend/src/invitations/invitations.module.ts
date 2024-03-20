import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsController } from './invitations.controller';
import { PrismaService } from 'nestjs-prisma';

@Module({
  controllers: [InvitationsController],
  providers: [InvitationsService, PrismaService]
})
export class InvitationsModule {}
