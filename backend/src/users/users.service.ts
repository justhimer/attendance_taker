import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { hashPasswordBcrypt } from 'src/utils/security/bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const password = await hashPasswordBcrypt(createUserDto.password);

      // create user and return user id
      const user = await this.prisma.users.create({
        data: {
          ...createUserDto,
          password,
        },
      });

      return {
        id: user.id,
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async findById(id: number) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { id },
      });

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });
      
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
