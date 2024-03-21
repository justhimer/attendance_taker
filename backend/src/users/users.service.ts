import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'nestjs-prisma';
import { hashPasswordBcrypt } from 'src/utils/security/bcrypt';
import { plainToClass } from "class-transformer";
import { User } from './entities/user.entity';

export interface FindUserRequest {
  id?: number;
  email?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<{ id: number }> {
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

  async find(request: FindUserRequest): Promise<User> {
    try {
      if (!request.id && !request.email) {
        throw 'Missing user id or email';
      }

      // find user by id or email
      const user = await this.prisma.users.findUnique({
        where: {
          id: request.id,
          email: request.email,
        },
      });

      let returnUser: User = null;
      if (user) {
        returnUser = plainToClass(User, user);
      }

      return returnUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      // if password is provided, hash it
      if (updateUserDto.password) {
        updateUserDto.password = await hashPasswordBcrypt(updateUserDto.password);
      }

      // update user and return updated user
      const user = await this.prisma.users.update({
        where: { id },
        data: updateUserDto,
      });

      return plainToClass(User, user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      // delete user and return deleted user
      await this.prisma.users.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
