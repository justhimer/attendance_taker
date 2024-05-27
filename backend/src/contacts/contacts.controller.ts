import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { Response, SuccessHttpStatus } from 'src/utils/api/Response';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createContact(@Request() req, @Body() createContactDto: CreateContactDto) {
    try {
      // check if user_id is the same as the logged in user
      if (req.user.id !== createContactDto.user_id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      // check if contact_id exists in users table
      const contactUser = await this.usersService.findByID(createContactDto.contact_id);
      if (!contactUser) {
        throw new HttpException('Contact does not exist', HttpStatus.NOT_FOUND);
      }

      // check if contact already exists
      const existingContact = await this.contactsService.findContactByContactUserId(createContactDto);
      if (existingContact) {
        throw new HttpException('Contact already exists', HttpStatus.CONFLICT);
      }

      const contactData = await this.contactsService.createContact(createContactDto);
      return new Response(SuccessHttpStatus.CREATED, contactData);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findContacts(@Request() req) {
    try {
      const contacts = await this.contactsService.findContacts(req.user.id);
      return new Response(SuccessHttpStatus.OK, contacts);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteContact(@Request() req, @Param('id') id: string) {
    try {
      const contactId = +id;
      const contact = await this.contactsService.findContactById(contactId);

      if (!contact) {
        throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
      }

      if (contact.user_id !== req.user.id) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const deletedContact = await this.contactsService.deleteContact(contactId);
      return new Response(SuccessHttpStatus.OK, deletedContact);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
