import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response, SuccessHttpStatus } from 'src/utils/api/response';
import { AcceptanceStatus, Invitation } from './entities/invitation.entity';
import { FilterInvitationDto } from './dto/filter-invitation.dto';

@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() createInvitationDto: CreateInvitationDto) {
    try {
      const invitationData = await this.invitationsService.create(
        req.user.id, 
        createInvitationDto
      );
      return new Response(SuccessHttpStatus.CREATED, invitationData);
    } catch (error) {
      Logger.error(error.message);
      if (error.message === this.invitationsService.createErrorMessages.NOT_FOUND) {
        error.status = HttpStatus.NOT_FOUND;
      }
      if (error.message === this.invitationsService.createErrorMessages.UNAUTHORIZED) {
        error.status = HttpStatus.UNAUTHORIZED;
      }
      if (error.message === this.invitationsService.createErrorMessages.USER_NOT_EXIST) {
        error.status = HttpStatus.BAD_REQUEST;
      }
      if (error.message === this.invitationsService.createErrorMessages.USER_ALREADY_INVITED) {
        error.status = HttpStatus.CONFLICT;
      }
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req, @Body() filter?: FilterInvitationDto) {
    try {
      const invitations = await this.invitationsService.findAll(req.user.id, filter);

      if (invitations.length === 0) {
        throw new HttpException('No invitations found.', HttpStatus.NOT_FOUND);
      }

      return new Response(SuccessHttpStatus.OK, invitations);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    try {
      const invitation = await this.invitationsService.findOne(+id, req.user.id);

      if (!invitation) {
        throw new HttpException('Invitation not found.', HttpStatus.NOT_FOUND);
      }

      return new Response(SuccessHttpStatus.OK, invitation);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateInvitationDto: UpdateInvitationDto) {
    try {
      // if updateInvitationDto is empty, throw an error
      if (Object.keys(updateInvitationDto).length === 0) {
        throw new HttpException('No data provided for update.', HttpStatus.BAD_REQUEST);
      }

      const invitation = await this.invitationsService.findOne(+id, req.user.id);

      if (!invitation) {
        throw new HttpException('Invitation not found.', HttpStatus.NOT_FOUND);
      }

      // only the invited user can change the status
      if (updateInvitationDto.status && invitation.user_id !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      // once the status is ACCEPTED or REJECTED, it cannot be changed. besides, it cannot be changed to PENDING.
      if (invitation.status === AcceptanceStatus.ACCEPTED || invitation.status === AcceptanceStatus.REJECTED || updateInvitationDto.status === AcceptanceStatus.PENDING) {
        throw new HttpException(`Status ${invitation.status} cannot be changed to ${updateInvitationDto.status}`, HttpStatus.BAD_REQUEST);
      }

      const updatedInvitation = await this.invitationsService.update(+id, updateInvitationDto);
      
      return new Response(SuccessHttpStatus.OK, updatedInvitation);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    try {
      const invitation = await this.invitationsService.findOne(+id, req.user.id);

      if (!invitation) {
        throw new HttpException('Invitation not found.', HttpStatus.NOT_FOUND);
      }

      // only the event host can delete the invitation
      if (invitation.event.hosted_by !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      await this.invitationsService.remove(+id);
      return new Response(SuccessHttpStatus.OK, `Invitation ${id} has been deleted`);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
