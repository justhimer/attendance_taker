import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger, UseGuards, Request } from '@nestjs/common';
import { FindUserRequest, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, SuccessHttpStatus } from 'src/utils/api/response';
import { ReturnUserDto } from './dto/return-user.dto';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  private validateID(reqID: number, id: string) {
    if (!id) {
      throw new HttpException('Missing user id', HttpStatus.BAD_REQUEST);
    }

    if (+id !== reqID) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  private async findUser(findUserRequest: FindUserRequest): Promise<User> {
    const user: User = await this.usersService.find(findUserRequest);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private omitUserPassword(user: User): ReturnUserDto {
    const { password, ...userWithoutPassword } = user;
    return plainToClass(ReturnUserDto, userWithoutPassword);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const foundUser = await this.usersService.find({ email: createUserDto.email });
      if (foundUser) {
        throw new HttpException('Email registered', HttpStatus.CONFLICT);
      }

      const userData = await this.usersService.create(createUserDto);
      return new Response(SuccessHttpStatus.CREATED, userData);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('me')
  // async findMe(@Request() req) {
  //   try {
  //     const user = await this.findUser({ id: req.user.id });

  //     const returnUser: ReturnUserDto = this.omitUserPassword(user);

  //     return new Response(SuccessHttpStatus.OK, returnUser);
  //   } catch (error) {
  //     Logger.error(error.message);
  //     throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Request() req, @Param('id') id: string) {
    try {
      this.validateID(req.user.id, id);

      const user = await this.findUser({ id: +id });

      const returnUser: ReturnUserDto = this.omitUserPassword(user);

      return new Response(SuccessHttpStatus.OK, returnUser);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      this.validateID(req.user.id, id);

      await this.findUser({ id: +id });  // check if user exists

      const updatedUser: User = await this.usersService.update(+id, updateUserDto);
      const returnUser: ReturnUserDto = this.omitUserPassword(updatedUser);

      return new Response(SuccessHttpStatus.OK, returnUser);
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    try {
      this.validateID(req.user.id, id);

      await this.findUser({ id: +id });  // check if user exists

      await this.usersService.remove(+id);

      return new Response(SuccessHttpStatus.OK, { message: `User ${id} deleted` });
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
