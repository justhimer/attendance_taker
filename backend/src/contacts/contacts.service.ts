import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'nestjs-prisma';
import { Contact } from './entities/contact.entity';
// import { UpdateContactDto } from './dto/update-contact.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) { }

  async createContact(createContactDto: CreateContactDto): Promise<{ id: number }>{
    try {
      const contact = await this.prisma.contacts.create({
        data: createContactDto,
      });
  
      return {
        id: contact.id,
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  // async createContacts(contacts: CreateContactDto[]): Promise<any> {
  //   try {
  //     const createdContacts = await this.prisma.contacts.createMany({
  //       data: contacts,
  //     });

  //     return createdContacts;
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async findContacts(userId: number): Promise<any> {
    try {
      const contacts = await this.prisma.contacts.findMany({
        where: {
          user_id: userId,
        },
        include: {
          contact: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true,
          },
        },
      },
    });

      let returnContacts: Contact[] = [];
      if (contacts.length > 0) {
        returnContacts = contacts.map((contact) => plainToClass(Contact, contact));
      }

      return contacts;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findContactById(contactId: number): Promise<any> {
    try {
      const contact = await this.prisma.contacts.findFirst({
        where: {
          id: contactId,
        },
      });

      return contact;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteContact(contactId: number): Promise<any> {
    try {
      const contact = await this.prisma.contacts.delete({
        where: {
          id: contactId,
        },
      });

      return contact;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findContactByContactUserId(createContactDto: CreateContactDto): Promise<any> {
    try {
      const contact = await this.prisma.contacts.findFirst({
        where: {
          user_id: createContactDto.user_id,
          contact_id: createContactDto.contact_id,
        },
      });

      return contact;
    } catch (error) {
      throw new Error(error);
    }
  }
}
