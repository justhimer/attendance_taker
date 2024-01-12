import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/utils/api/response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      // check if email has been registered
      const foundUser = await this.usersService.findByEmail(createUserDto.email);
      if (foundUser) {
        throw new HttpException('Email registered', HttpStatus.CONFLICT);
      }

      // create user
      const userData = await this.usersService.create(createUserDto);
      Logger.log('User created');

      // return user data
      const rs = new Response();
      rs.statusCode = HttpStatus.CREATED;
      rs.data = userData;
      return rs;
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findById(+id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const rs = new Response();
      rs.statusCode = HttpStatus.FOUND;
      rs.data = user;
      return rs;
    } catch (error) {
      Logger.error(error.message);
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
