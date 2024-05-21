import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { PrismaService } from 'nestjs-prisma';
import { Invitation, InvitationWithEventDetails } from './entities/invitation.entity';
import { plainToClass } from 'class-transformer';
import { FilterInvitationDto } from './dto/filter-invitation.dto';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) { }

  createErrorMessages = {
    NOT_FOUND: 'The event does not exist.',
    UNAUTHORIZED: 'You are not the host of the event.',
    USER_NOT_EXIST: 'The user does not exist.',
    USER_ALREADY_INVITED: 'The user is already invited to the event.',
  }

  async create(
    inviterId: number, 
    createInvitationDto: CreateInvitationDto
  ): Promise<{ id: number }>{
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const event = await tx.events.findFirst({
          where: {
            id: createInvitationDto.event_id
          },
        });
        // check if the event exists
        if (!event) {
          throw this.createErrorMessages.NOT_FOUND;
        }
        // check if the inviter is the host
        if (event.hosted_by !== inviterId) {
          throw this.createErrorMessages.UNAUTHORIZED;
        }
        // check if the invitee is the host
        if (event.hosted_by === createInvitationDto.user_id) {
          throw new HttpException('You cannot invite yourself.', HttpStatus.BAD_REQUEST);
        }

        // check if the invitation is created for an existing user
        const user = await tx.users.findFirst({
          where: {
            id: createInvitationDto.user_id,
          },
        });
        if (!user) {
          throw this.createErrorMessages.USER_NOT_EXIST;
        }

        // check if the user is already invited
        const invitation = await tx.invitations.findFirst({
          where: {
            event_id: createInvitationDto.event_id,
            user_id: createInvitationDto.user_id,
          },
        });
        if (invitation) {
          throw this.createErrorMessages.USER_ALREADY_INVITED;
        }

        // create the invitation
        const newInvitation = await tx.invitations.create({
          data: createInvitationDto,
        });

        return {
          id: newInvitation.id,
        }
      });

      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  // only the event host or the invited user can see the invitations
  async findAll(viewerId: number, filter?: FilterInvitationDto): Promise<Invitation[]>{
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
  
      if (filter?.user_id) {
        whereClause.user_id = filter.user_id;
      }
  
      if (filter?.event_id) {
        whereClause.event_id = filter.event_id;
      }

      if (filter?.status) {
        whereClause.status = filter.status;
      }
  
      const invitations = await this.prisma.invitations.findMany({
        where: whereClause,
        include: {
          event: true,
        },
      });
  
      return invitations.map(invitation => plainToClass(Invitation, invitation));
    } catch (error) {
      throw new Error(error);
    }
  }

  // only the event host or the invited user can see the invitation
  async findOne(id: number, viewerId: number): Promise<InvitationWithEventDetails>{
    try {
      // find invitation and select the event as well
      const invitation = await this.prisma.invitations.findFirst({
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

      return plainToClass(InvitationWithEventDetails, invitation);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(
    id: number,
    updateInvitationDto: UpdateInvitationDto
  ): Promise<Invitation>{
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const updatedInvitation = await tx.invitations.update({
          where: { id },
          data: updateInvitationDto,
        });

        // if the invitation is accepted, create an attendance record
        if (updateInvitationDto.status === 'ACCEPTED') {
          const createAttendanceDto = {
            user_id: updatedInvitation.user_id,
            event_id: updatedInvitation.event_id,
          };
          await tx.attendance.create({
            data: createAttendanceDto,
          });
        }

        return updatedInvitation;
      });

      return plainToClass(Invitation, result);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void>{
    try {
      await this.prisma.invitations.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // create(createInvitationDto: CreateInvitationDto) {
  //   return 'This action adds a new invitation';
  // }

  // findAll() {
  //   return `This action returns all invitations`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} invitation`;
  // }

  // update(id: number, updateInvitationDto: UpdateInvitationDto) {
  //   return `This action updates a #${id} invitation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} invitation`;
  // }
}
