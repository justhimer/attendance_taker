import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response, SuccessHttpStatus } from 'src/utils/api/response';
import { ReturnUserDto } from './dto/return-user.dto';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async find(@Request() req) {
    try {
      const id = req.user.id;

      const user = await this.usersService.find({ id: +id });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Omit the password field
      const { password, ...userWithoutPassword } = user;
      const returnUser = plainToClass(ReturnUserDto, userWithoutPassword);

      return new Response(SuccessHttpStatus.OK, returnUser);
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
